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
  private movables: (Mesh | ICollisionObject)[] = [];
  private lastEntryCollision: ICollisionObject | null = null;
  private isAnimating: boolean = false;
  private currentAnimatedEntry: ICollisionObject | null = null;

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
    this.loop();
  }

  private loop = () => {
    if (this.gameStateManager.getCurrentState() === 'playing') {
      if (!this.isAnimating) {
        this.updateMovement();
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

  private updateMovement() {
    const directions: { key: KeyCode; direction: 'up' | 'down' | 'left' | 'right' }[] = [
      { key: 'KeyW', direction: 'up' },
      { key: 'KeyA', direction: 'left' },
      { key: 'KeyS', direction: 'down' },
      { key: 'KeyD', direction: 'right' }
    ];

    for (const { key, direction } of directions) {
      if (this.inputHandler.isKeyPressed(key) && this.inputHandler.lastKeyPressed === key) {
        if (!this.collisionManager.checkCollision(this.player, direction)) {
          this.moveWorld(direction);
        }
        this.player.setDirection(direction);
        break;
      }
    }
  }

  private moveWorld(direction: 'up' | 'down' | 'left' | 'right') {
    const speed = PLAYER_CONSTANTS.SPEED;

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