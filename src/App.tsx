import React, { useRef, useEffect, useState } from "react";
import { Player } from "./components/Player.ts";
import { InputHandler } from "./components/InputHandler.ts";
import { CollisionManager } from "./components/CollisionManager.ts";
import { GameLoop } from "./components/GameLoop.ts";
import { GameCamera } from "./components/GameCamera.ts";
import { GameRenderer } from "./components/GameRenderer.ts";
import { GameStateManager, GameState } from "./components/GameStateManager.ts";
import { WorkHistoryEntry } from "./components/WorkHistoryEntry.tsx";
import { PersonalEntry } from "./components/PersonalEntry.tsx";
import { HobbiesEntry } from "./components/HobbiesEntry.tsx";
import { RandomEntry } from "./components/RandomEntry.tsx";
import { WASDIndicator } from "./components/WASDIndicator.tsx";
import "./App.css";

function App() {
  const mapRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState<GameState>('playing');
  const [gameLoop, setGameLoop] = useState<GameLoop | null>(null);
  const [entryPosition, setEntryPosition] = useState<{ x: number; y: number } | undefined>();
  const [inputHandler, setInputHandler] = useState<InputHandler | null>(null);
  const [pressedKeys, setPressedKeys] = useState({
    KeyW: false,
    KeyA: false,
    KeyS: false,
    KeyD: false
  });

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

        setInputHandler(inputHandler);

        gameStateManager.setStateChangeCallback((newState: GameState) => {
          setGameState(newState);
          if (newState.startsWith('entry-')) {
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

  // Update pressed keys state
  useEffect(() => {
    if (!inputHandler) return;

    const updateKeys = () => {
      const keys = inputHandler.getKeys();
      setPressedKeys(keys);
    };

    const interval = setInterval(updateKeys, 16); // ~60fps
    return () => clearInterval(interval);
  }, [inputHandler]);

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
      {gameState === 'playing' && <WASDIndicator pressedKeys={pressedKeys} />}
      {gameState === 'entry-work' && (
        <WorkHistoryEntry 
          onReturnToMap={handleReturnToMap}
          entryPosition={entryPosition}
        />
      )}
      {gameState === 'entry-personal' && (
        <PersonalEntry 
          onReturnToMap={handleReturnToMap}
          entryPosition={entryPosition}
        />
      )}
      {gameState === 'entry-hobbies' && (
        <HobbiesEntry 
          onReturnToMap={handleReturnToMap}
          entryPosition={entryPosition}
        />
      )}
      {gameState === 'entry-random' && (
        <RandomEntry 
          onReturnToMap={handleReturnToMap}
          entryPosition={entryPosition}
        />
      )}
    </>
  );
}

export default App;