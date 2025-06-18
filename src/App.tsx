import React, { useRef, useEffect, useState } from "react";
import { Player } from "./components/Player.ts";
import { InputHandler } from "./components/InputHandler.ts";
import { CollisionManager } from "./components/CollisionManager.ts";
import { GameLoop } from "./components/GameLoop.ts";
import { GameCamera } from "./components/GameCamera.ts";
import { GameRenderer } from "./components/GameRenderer.ts";
import { GameStateManager, GameState } from "./components/GameStateManager.ts";
import { EntryOverlay } from "./components/EntryOverlay.tsx";
import "./App.css";

function App() {
  const mapRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState<GameState>('playing');
  const [gameLoop, setGameLoop] = useState<GameLoop | null>(null);
  const [entryPosition, setEntryPosition] = useState<{ x: number; y: number } | undefined>();

  useEffect(() => {
    const canvas = mapRef.current;
    if (canvas) {
      const initializeGame = async () => {
        const gameRenderer = new GameRenderer(canvas);
        const gameCamera = new GameCamera();
        const player = new Player();
        const inputHandler = new InputHandler();
        const collisionManager = new CollisionManager();
        const gameStateManager = new GameStateManager();

        gameStateManager.setStateChangeCallback((newState: GameState) => {
          setGameState(newState);
          if (newState === 'entry-overlay') {
            const savedPosition = gameStateManager.getSavedPosition();
            if (savedPosition) {
              setEntryPosition({
                x: savedPosition.entryPoint.mesh.position.x,
                y: savedPosition.entryPoint.mesh.position.y
              });
            }
          }
        });

        player.addToScene(gameRenderer.getScene());
        gameRenderer.addCollidersToScene(collisionManager);

        const background = await gameRenderer.loadBackground();
        
        const newGameLoop = new GameLoop(
          player,
          inputHandler,
          collisionManager,
          gameStateManager,
          gameRenderer.getRenderer(),
          gameCamera.getCamera(),
          gameRenderer.getScene(),
          background
        );

        setGameLoop(newGameLoop);
        newGameLoop.start();
      };

      initializeGame();
    }
  }, []);

  const handleReturnToMap = () => {
    if (gameLoop) {
      gameLoop.restorePosition();
      setEntryPosition(undefined);
    }
  };

  return (
    <>
      <canvas 
        ref={mapRef} 
        id="wes_com"
        style={{ display: gameState === 'playing' ? 'block' : 'none' }}
      ></canvas>
      {gameState === 'entry-overlay' && (
        <EntryOverlay 
          onReturnToMap={handleReturnToMap}
          entryPosition={entryPosition}
        />
      )}
    </>
  );
}

export default App;