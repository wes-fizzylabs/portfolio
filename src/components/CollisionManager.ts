import { Mesh, PlaneGeometry, MeshBasicMaterial, Color } from 'three';
import { boundaries } from './boundaries.ts';
import { entries } from './entries.ts';
import { MAP_CONSTANTS } from '../constants.tsx';
import { isCollided } from '../utils/utils.ts';
import { Player } from './Player.ts';

export interface ICollisionObject {
  type: 'boundary' | 'entry';
  mesh: Mesh;
  entryType?: 'work' | 'personal' | 'hobbies' | 'random';
  visualMesh?: Mesh;
  originalColor?: Color;
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

    const entryTypes: ('work' | 'personal' | 'hobbies' | 'random')[] = ['work', 'personal', 'hobbies', 'random'];
    let entryIndex = 0;

    entryMap.forEach((row, i) => {
      row.forEach((el, j) => {
        if (el === MAP_CONSTANTS.ENTRY) {
          const createdEntry = new Collider('entry', {
            x: j * 64 + -1526,
            y: -i * 64 + 760
          });
          let _collider = createdEntry.getColliderObject();
          _collider.mesh.scale.set(4, 4, 4);
          _collider.entryType = entryTypes[entryIndex % entryTypes.length];

          const visualGeometry = new PlaneGeometry(16, 16);
          const visualMaterial = new MeshBasicMaterial({
            color: 0x000000,
            transparent: true,
            opacity: 0
          });
          const visualMesh = new Mesh(visualGeometry, visualMaterial);
          visualMesh.position.copy(_collider.mesh.position);
          visualMesh.scale.set(4, 4, 4);
          visualMesh.renderOrder = -1;

          _collider.visualMesh = visualMesh;
          _collider.originalColor = new Color(0x000000);

          this.entryPoints.push(_collider);
          entryIndex++;
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

  public animateEntryDoorOpening(entry: ICollisionObject): Promise<void> {
    return new Promise((resolve) => {
      if (!entry.visualMesh) {
        resolve();
        return;
      }

      const startTime = performance.now();
      const duration = 300;
      const material = entry.visualMesh.material as MeshBasicMaterial;

      const animate = () => {
        const elapsed = performance.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);

        material.opacity = progress;

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          resolve();
        }
      };

      requestAnimationFrame(animate);
    });
  }

  public resetEntryToTransparent(entry: ICollisionObject): void {
    if (entry.visualMesh) {
      const material = entry.visualMesh.material as MeshBasicMaterial;
      material.opacity = 0;
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
    const material = new MeshBasicMaterial({ opacity: 0, transparent: true });
    this.collisionObject.mesh = new Mesh(geometry, material);
    this.collisionObject.mesh.position.set(position.x, position.y, 0);
    this.collisionObject.type = type;
  }

  getColliderObject() {
    return this.collisionObject;
  }
}