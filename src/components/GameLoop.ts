import { Player } from './Player.ts';
import { InputHandler, KeyCode } from './InputHandler.ts';
import { CollisionManager, ICollisionObject } from './CollisionManager.ts';
import { GameStateManager } from './GameStateManager.ts';
import { PLAYER_CONSTANTS } from '../constants.tsx';
import { WebGLRenderer, OrthographicCamera, Scene, Mesh } from 'three';

export class GameLoop {
  private player: Player;
  private inputHandler: InputHandler;
  private collisionManager: CollisionManager;
  private gameStateManager: GameStateManager;
  private renderer: WebGLRenderer;
  private camera: OrthographicCamera;
  private scene: Scene;
  private background: Mesh;
  private movables: (Mesh | ICollisionObject)[] = []; // Used for collision detection
  private lastEntryCollision: ICollisionObject | null = null;
  private isAnimating: boolean = false;
  private currentAnimatedEntry: ICollisionObject | null = null;
  private lastTime: number = 0;

  constructor(
    player: Player,
    inputHandler: InputHandler,
    collisionManager: CollisionManager,
    gameStateManager: GameStateManager,
    renderer: WebGLRenderer,
    camera: OrthographicCamera,
    scene: Scene,
    background: Mesh
  ) {
    this.player = player;
    this.inputHandler = inputHandler;
    this.collisionManager = collisionManager;
    this.gameStateManager = gameStateManager;
    this.renderer = renderer;
    this.camera = camera;
    this.scene = scene;
    this.background = background;

    this.movables = [background, ...collisionManager.getColliders()];
  }

  public start() {
    this.lastTime = performance.now();
    this.loop(this.lastTime);
  }

  private loop = (currentTime: number) => {
    const deltaTime = currentTime - this.lastTime;
    this.lastTime = currentTime;
    
    if (this.gameStateManager.getCurrentState() === 'playing') {
      if (!this.isAnimating) {
        this.updateMovement(deltaTime);
        this.updatePlayerRest();
        this.checkEntryCollisions();
      }
      this.renderer.render(this.scene, this.camera);
    }
    requestAnimationFrame(this.loop);
  }

  private updatePlayerRest() {
    if (!this.inputHandler.isAnyKeyPressed()) {
      this.player.rest();
    }
  }

  private updateMovement(deltaTime: number) {
    const pressedKeys = this.inputHandler.getKeys();
    
    // Calculate net movement direction
    let netX = 0;
    let netY = 0;
    
    if (pressedKeys.KeyW) netY += 1;  // up
    if (pressedKeys.KeyS) netY -= 1;  // down
    if (pressedKeys.KeyA) netX -= 1;  // left
    if (pressedKeys.KeyD) netX += 1;  // right
    
    // If no movement or opposite keys cancel out
    if (netX === 0 && netY === 0) {
      return;
    }
    
    // Determine primary and secondary directions
    let primaryDirection: 'up' | 'down' | 'left' | 'right' | null = null;
    let secondaryDirection: 'up' | 'down' | 'left' | 'right' | null = null;
    
    if (netY > 0) primaryDirection = 'up';
    else if (netY < 0) primaryDirection = 'down';
    
    if (netX > 0) {
      if (primaryDirection) secondaryDirection = 'right';
      else primaryDirection = 'right';
    } else if (netX < 0) {
      if (primaryDirection) secondaryDirection = 'left';
      else primaryDirection = 'left';
    }
    
    // Check collision for primary direction
    let canMovePrimary = primaryDirection ? !this.collisionManager.checkCollision(this.player, primaryDirection) : false;
    let canMoveSecondary = secondaryDirection ? !this.collisionManager.checkCollision(this.player, secondaryDirection) : false;
    
    // Move in available directions with normalized speed and delta time
    const isDiagonal = canMovePrimary && canMoveSecondary && primaryDirection && secondaryDirection;
    const speedMultiplier = isDiagonal ? 0.707 : 1.0; // 1/√2 for diagonal movement
    
    if (canMovePrimary && primaryDirection) {
      this.moveWorld(primaryDirection, speedMultiplier, deltaTime);
    }
    if (canMoveSecondary && secondaryDirection) {
      this.moveWorld(secondaryDirection, speedMultiplier, deltaTime);
    }
    
    // Set player sprite direction (prioritize the last pressed key if both directions are available)
    if (primaryDirection && secondaryDirection) {
      // Use the last pressed key to determine sprite direction
      const lastKey = this.inputHandler.lastKeyPressed;
      const directionMap: Record<KeyCode, 'up' | 'down' | 'left' | 'right'> = {
        KeyW: 'up',
        KeyS: 'down',
        KeyA: 'left',
        KeyD: 'right'
      };
      
      if (lastKey && pressedKeys[lastKey]) {
        this.player.setDirection(directionMap[lastKey]);
      } else {
        this.player.setDirection(primaryDirection);
      }
    } else if (primaryDirection) {
      this.player.setDirection(primaryDirection);
    }
  }

  private moveWorld(direction: 'up' | 'down' | 'left' | 'right', speedMultiplier: number = 1.0, deltaTime: number = 16.67) {
    // Maintain original movement distance
    const speed = PLAYER_CONSTANTS.SPEED * speedMultiplier * (deltaTime / 16.67);

    switch (direction) {
      case 'up':
        this.background.position.y -= speed;
        this.collisionManager.getColliders().forEach((boundary) => {
          boundary.mesh.position.y -= speed;
        });
        this.collisionManager.getEntryPoints().forEach((entry) => {
          entry.mesh.position.y -= speed;
          if (entry.visualMesh) {
            entry.visualMesh.position.y -= speed;
          }
        });
        break;
      case 'down':
        this.background.position.y += speed;
        this.collisionManager.getColliders().forEach((boundary) => {
          boundary.mesh.position.y += speed;
        });
        this.collisionManager.getEntryPoints().forEach((entry) => {
          entry.mesh.position.y += speed;
          if (entry.visualMesh) {
            entry.visualMesh.position.y += speed;
          }
        });
        break;
      case 'left':
        this.background.position.x += speed;
        this.collisionManager.getColliders().forEach((boundary) => {
          boundary.mesh.position.x += speed;
        });
        this.collisionManager.getEntryPoints().forEach((entry) => {
          entry.mesh.position.x += speed;
          if (entry.visualMesh) {
            entry.visualMesh.position.x += speed;
          }
        });
        break;
      case 'right':
        this.background.position.x -= speed;
        this.collisionManager.getColliders().forEach((boundary) => {
          boundary.mesh.position.x -= speed;
        });
        this.collisionManager.getEntryPoints().forEach((entry) => {
          entry.mesh.position.x -= speed;
          if (entry.visualMesh) {
            entry.visualMesh.position.x -= speed;
          }
        });
        break;
    }
  }

  private checkEntryCollisions() {
    const entryCollision = this.collisionManager.checkEntryCollision(this.player);

    if (entryCollision && entryCollision !== this.lastEntryCollision) {
      console.log('Player entered an entry point!');
      this.lastEntryCollision = entryCollision;
      this.startEntryAnimation(entryCollision);
    } else if (!entryCollision) {
      this.lastEntryCollision = null;
    }
  }

  private async startEntryAnimation(entry: ICollisionObject) {
    this.isAnimating = true;
    this.currentAnimatedEntry = entry;

    try {
      this.gameStateManager.saveCurrentPosition(
        this.player,
        this.background,
        this.collisionManager.getColliders(),
        this.collisionManager.getEntryPoints(),
        entry
      );

      await this.collisionManager.animateEntryDoorOpening(entry);

      const playerDirection = this.determinePlayerDirectionToEntry(entry);
      await this.player.animateWalkForward(playerDirection, 35);

      if (entry.entryType) {
        this.gameStateManager.enterEntry(entry.entryType);
      }
    } catch (error) {
      console.error('Entry animation failed:', error);
    } finally {
      this.isAnimating = false;
    }
  }

  private determinePlayerDirectionToEntry(entry: ICollisionObject): 'up' | 'down' | 'left' | 'right' {
    const playerPos = this.player.sprite.position;
    const entryPos = entry.mesh.position;

    const deltaX = entryPos.x - playerPos.x;
    const deltaY = entryPos.y - playerPos.y;

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      return deltaX > 0 ? 'right' : 'left';
    } else {
      return deltaY > 0 ? 'up' : 'down';
    }
  }

  public restorePosition() {
    const savedPosition = this.gameStateManager.returnToGame();
    if (savedPosition) {
      this.player.sprite.position.set(
        savedPosition.playerPosition.x,
        savedPosition.playerPosition.y,
        savedPosition.playerPosition.z
      );

      this.background.position.set(
        savedPosition.backgroundPosition.x,
        savedPosition.backgroundPosition.y,
        savedPosition.backgroundPosition.z
      );

      const boundaries = this.collisionManager.getColliders();
      savedPosition.boundaryPositions.forEach((pos, index) => {
        if (boundaries[index]) {
          boundaries[index].mesh.position.set(pos.x, pos.y, pos.z);
        }
      });

      const entries = this.collisionManager.getEntryPoints();
      savedPosition.entryPositions.forEach((pos, index) => {
        if (entries[index]) {
          entries[index].mesh.position.set(pos.x, pos.y, pos.z);
          if (entries[index].visualMesh) {
            entries[index].visualMesh!.position.set(pos.x, pos.y, pos.z);
          }
        }
      });

      if (this.currentAnimatedEntry) {
        this.collisionManager.resetEntryToTransparent(this.currentAnimatedEntry);
        this.currentAnimatedEntry = null;
      }

      this.gameStateManager.movePlayerAwayFromEntry(this.player, 'down');
      this.player.resetToDownSprite();
      this.lastEntryCollision = null;
    }
  }
}