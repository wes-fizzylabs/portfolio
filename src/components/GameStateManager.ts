import { Mesh } from 'three';
import { ICollisionObject } from './CollisionManager';
import { Player } from './Player';

export type GameState = 'playing' | 'entry-work' | 'entry-personal' | 'entry-hobbies' | 'entry-random';

export interface SavedGamePosition {
  playerPosition: { x: number; y: number; z: number };
  backgroundPosition: { x: number; y: number; z: number };
  boundaryPositions: Array<{ id: string; x: number; y: number; z: number }>;
  entryPositions: Array<{ id: string; x: number; y: number; z: number }>;
  entryPoint: ICollisionObject;
}

export class GameStateManager {
  private currentState: GameState = 'playing';
  private savedPosition: SavedGamePosition | null = null;
  private stateChangeCallback: ((state: GameState) => void) | null = null;

  public getCurrentState(): GameState {
    return this.currentState;
  }

  public setStateChangeCallback(callback: (state: GameState) => void) {
    this.stateChangeCallback = callback;
  }

  public saveCurrentPosition(
    player: Player,
    background: Mesh,
    boundaries: ICollisionObject[],
    entries: ICollisionObject[],
    entryPoint: ICollisionObject
  ) {
    this.savedPosition = {
      playerPosition: {
        x: player.sprite.position.x,
        y: player.sprite.position.y,
        z: player.sprite.position.z
      },
      backgroundPosition: {
        x: background.position.x,
        y: background.position.y,
        z: background.position.z
      },
      boundaryPositions: boundaries.map((boundary, index) => ({
        id: `boundary-${index}`,
        x: boundary.mesh.position.x,
        y: boundary.mesh.position.y,
        z: boundary.mesh.position.z
      })),
      entryPositions: entries.map((entry, index) => ({
        id: `entry-${index}`,
        x: entry.mesh.position.x,
        y: entry.mesh.position.y,
        z: entry.mesh.position.z
      })),
      entryPoint
    };
  }

  public enterEntry(entryType: 'work' | 'personal' | 'hobbies' | 'random') {
    this.currentState = `entry-${entryType}` as GameState;
    if (this.stateChangeCallback) {
      this.stateChangeCallback(this.currentState);
    }
  }

  public returnToGame(): SavedGamePosition | null {
    this.currentState = 'playing';
    if (this.stateChangeCallback) {
      this.stateChangeCallback(this.currentState);
    }
    return this.savedPosition;
  }

  public getSavedPosition(): SavedGamePosition | null {
    return this.savedPosition;
  }

  public movePlayerAwayFromEntry(
    player: Player,
    direction: 'up' | 'down' | 'left' | 'right' = 'down'
  ) {
    const offset = 5;

    switch (direction) {
      case 'up':
        player.sprite.position.y += offset;
        break;
      case 'down':
        player.sprite.position.y -= offset;
        break;
      case 'left':
        player.sprite.position.x -= offset;
        break;
      case 'right':
        player.sprite.position.x += offset;
        break;
    }
  }
}