import { WebGLRenderer, Scene, Mesh, MeshBasicMaterial, PlaneGeometry, TextureLoader } from 'three';
import { NearestFilter } from 'three';
import { MAP_CONSTANTS } from '../constants.tsx';
import { CollisionManager } from './CollisionManager.ts';

export class GameRenderer {
  public renderer: WebGLRenderer;
  public scene: Scene;
  public background?: Mesh;

  constructor(canvas: HTMLCanvasElement) {
    this.setupRenderer(canvas);
    this.scene = new Scene();
  }

  private setupRenderer(canvas: HTMLCanvasElement) {
    const width = window.innerWidth;
    const height = window.innerHeight;

    canvas.width = width;
    canvas.height = height;

    this.renderer = new WebGLRenderer({ 
      canvas,
      antialias: false,
      powerPreference: "high-performance"
    });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1));
  }

  public async loadBackground(): Promise<Mesh> {
    return new Promise((resolve) => {
      const textureLoader = new TextureLoader();
      textureLoader.load('/assets/map/Wesdev.png', (texture: any) => {
        texture.magFilter = NearestFilter;
        texture.minFilter = NearestFilter;
        const material = new MeshBasicMaterial({ map: texture });
        this.background = new Mesh(
          new PlaneGeometry(MAP_CONSTANTS.PLANE_WIDTH, MAP_CONSTANTS.PLANE_HEIGHT),
          material
        );
        this.background.position.set(
          MAP_CONSTANTS.INIT_X,
          MAP_CONSTANTS.INIT_Y,
          MAP_CONSTANTS.INIT_Z
        );
        this.scene.add(this.background);
        resolve(this.background);
      });
    });
  }

  public addCollidersToScene(collisionManager: CollisionManager) {
    collisionManager.getColliders().forEach((boundary) => {
      boundary.mesh.renderOrder = 1;
      this.scene.add(boundary.mesh);
    });
    
    collisionManager.getEntryPoints().forEach((entry) => {
      entry.mesh.renderOrder = 1;
      this.scene.add(entry.mesh);
      
      if (entry.visualMesh) {
        this.scene.add(entry.visualMesh);
      }
    });
  }

  public getRenderer(): WebGLRenderer {
    return this.renderer;
  }

  public getScene(): Scene {
    return this.scene;
  }
}