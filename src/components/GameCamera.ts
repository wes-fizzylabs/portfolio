import { OrthographicCamera } from 'three';
import { MAP_CONSTANTS, CAMERA_CONSTANTS } from '../constants.tsx';

export class GameCamera {
  public camera: OrthographicCamera;

  constructor() {
    this.setupCamera();
  }

  private setupCamera() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const aspectRatio = width / height;

    this.camera = new OrthographicCamera(
      (-MAP_CONSTANTS.FRUSTUM_SIZE * aspectRatio) / 2,
      (MAP_CONSTANTS.FRUSTUM_SIZE * aspectRatio) / 2,
      MAP_CONSTANTS.FRUSTUM_SIZE / 2,
      -MAP_CONSTANTS.FRUSTUM_SIZE / 2,
      0.1,
      2000
    );

    this.camera.position.set(
      CAMERA_CONSTANTS.INIT_X,
      CAMERA_CONSTANTS.INIT_Y,
      CAMERA_CONSTANTS.INIT_Z
    );
    
    this.camera.lookAt(
      CAMERA_CONSTANTS.INIT_X,
      CAMERA_CONSTANTS.INIT_Y,
      0
    );
  }

  public getCamera(): OrthographicCamera {
    return this.camera;
  }
}