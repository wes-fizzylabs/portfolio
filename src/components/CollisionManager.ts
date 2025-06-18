import { Mesh, PlaneGeometry, MeshBasicMaterial } from 'three';
import { boundaries } from './boundaries.ts';
import { entries } from './entries.ts';
import { MAP_CONSTANTS } from '../constants.tsx';
import { isCollided } from '../utils/utils.ts';
import { Player } from './Player.ts';

export interface ICollisionObject {
  type: 'boundary' | 'entry';
  mesh: Mesh;
}

export class CollisionManager {
  private mapBounds: ICollisionObject[] = [];
  private entryPoints: ICollisionObject[] = [];

  constructor() {
    this.initializeBoundaryColliders();
    this.initializeEntryColliders();
  }

  private initializeBoundaryColliders() {
    const collisionMap: number[][] = [];
    for (let i = 0; i < boundaries.length; i += 50) {
      collisionMap.push(boundaries.slice(i, i + 50));
    }

    collisionMap.forEach((row, i) => {
      row.forEach((el, j) => {
        if (el === MAP_CONSTANTS.BARRIER) {
          const createdBoundary = new Collider('boundary', {
            x: j * 64 + -1526,
            y: -i * 64 + 760
          });
          let _collider = createdBoundary.getColliderObject();
          _collider.mesh.scale.set(4, 4, 4);
          this.mapBounds.push(_collider);
        }
      });
    });
  }

  private initializeEntryColliders() {
    const entryMap: number[][] = [];
    for (let i = 0; i < entries.length; i += 50) {
      entryMap.push(entries.slice(i, i + 50));
    }

    entryMap.forEach((row, i) => {
      row.forEach((el, j) => {
        if (el === MAP_CONSTANTS.ENTRY) {
          const createdEntry = new Collider('entry', {
            x: j * 64 + -1526,
            y: -i * 64 + 760
          });
          let _collider = createdEntry.getColliderObject();
          _collider.mesh.scale.set(4, 4, 4);
          this.entryPoints.push(_collider);
        }
      });
    });
  }

  public getColliders(): ICollisionObject[] {
    return this.mapBounds;
  }

  public getEntryPoints(): ICollisionObject[] {
    return this.entryPoints;
  }

  public getAllColliders(): ICollisionObject[] {
    return [...this.mapBounds, ...this.entryPoints];
  }

  public checkCollision(player: Player, direction: 'up' | 'down' | 'left' | 'right'): boolean {
    const offset = this.getDirectionOffset(direction);
    
    for (let i = 0; i < this.mapBounds.length; i++) {
      if (isCollided({
        rect1: player.sprite,
        rect2: {
          ...this.mapBounds[i],
          position: {
            x: this.mapBounds[i].mesh.position.x + offset.x,
            y: this.mapBounds[i].mesh.position.y + offset.y
          }
        }
      })) {
        return true;
      }
    }
    return false;
  }

  public checkEntryCollision(player: Player): ICollisionObject | null {
    for (let i = 0; i < this.entryPoints.length; i++) {
      if (isCollided({
        rect1: player.sprite,
        rect2: {
          ...this.entryPoints[i],
          position: {
            x: this.entryPoints[i].mesh.position.x,
            y: this.entryPoints[i].mesh.position.y
          }
        }
      })) {
        return this.entryPoints[i];
      }
    }
    return null;
  }

  private getDirectionOffset(direction: 'up' | 'down' | 'left' | 'right'): { x: number; y: number } {
    switch (direction) {
      case 'up': return { x: 0, y: -3 };
      case 'down': return { x: 0, y: 3 };
      case 'left': return { x: 3, y: 0 };
      case 'right': return { x: -3, y: 0 };
    }
  }
}

class Collider {
  collisionObject: ICollisionObject = {
    type: 'boundary',
    mesh: null as any
  };

  constructor(type: 'boundary' | 'entry', position: { x: number; y: number }) {
    const geometry = new PlaneGeometry(16, 16);
    const material = new MeshBasicMaterial({ opacity: 0, color: 0x000000, transparent: false });
    this.collisionObject.mesh = new Mesh(geometry, material);
    this.collisionObject.mesh.position.set(position.x, position.y, 0);
    this.collisionObject.type = type;
  }

  getColliderObject() {
    return this.collisionObject;
  }
}