import {
  Sprite,
  SpriteMaterial,
  TextureLoader,
  Scene
} from 'three';
import { PLAYER_CONSTANTS, GAME_CONSTANTS } from '../constants.tsx';

export class Player {
  public sprite!: Sprite;
  public materials!: {
    up: SpriteMaterial;
    down: SpriteMaterial;
    left: SpriteMaterial;
    right: SpriteMaterial;
  };
  private currentFrame = 0;
  private frameTime = 100;
  private lastFrameChangeTime = 0;
  private totalFrames = PLAYER_CONSTANTS.COLUMNS * PLAYER_CONSTANTS.ROWS;
  public lastDirectionSprite?: SpriteMaterial;

  constructor() {
    this.loadTextures();
    this.createSprite();
  }

  private loadTextures() {
    const textureLoader = new TextureLoader();

    const playerUpTexture = textureLoader.load('/assets/players/playerUp.png');
    const playerDownTexture = textureLoader.load('/assets/players/playerDown.png');
    const playerLeftTexture = textureLoader.load('/assets/players/playerLeft.png');
    const playerRightTexture = textureLoader.load('/assets/players/playerRight.png');

    // Set initial texture coordinates for all textures
    playerUpTexture.offset.set(0, 0);
    playerUpTexture.repeat.set(GAME_CONSTANTS.FRAME_WIDTH, GAME_CONSTANTS.FRAME_HEIGHT);
    
    playerDownTexture.offset.set(0, 0);
    playerDownTexture.repeat.set(GAME_CONSTANTS.FRAME_WIDTH, GAME_CONSTANTS.FRAME_HEIGHT);
    
    playerLeftTexture.offset.set(0, 0);
    playerLeftTexture.repeat.set(GAME_CONSTANTS.FRAME_WIDTH, GAME_CONSTANTS.FRAME_HEIGHT);
    
    playerRightTexture.offset.set(0, 0);
    playerRightTexture.repeat.set(GAME_CONSTANTS.FRAME_WIDTH, GAME_CONSTANTS.FRAME_HEIGHT);

    this.materials = {
      up: new SpriteMaterial({ map: playerUpTexture }),
      down: new SpriteMaterial({ map: playerDownTexture }),
      left: new SpriteMaterial({ map: playerLeftTexture }),
      right: new SpriteMaterial({ map: playerRightTexture })
    };
  }

  private createSprite() {
    this.sprite = new Sprite(this.materials.down);
    this.sprite.position.set(
      PLAYER_CONSTANTS.INIT_X,
      PLAYER_CONSTANTS.INIT_Y,
      PLAYER_CONSTANTS.INIT_Z
    );
    this.sprite.scale.set(
      PLAYER_CONSTANTS.SCALE,
      PLAYER_CONSTANTS.SCALE,
      PLAYER_CONSTANTS.SCALE
    );
  }

  public addToScene(scene: Scene) {
    scene.add(this.sprite);
  }

  public setDirection(direction: 'up' | 'down' | 'left' | 'right') {
    const material = this.materials[direction];
    this.sprite.material = material;
    this.updateSpriteFrame(material);
    this.lastDirectionSprite = material;
  }

  public rest() {
    if (this.lastDirectionSprite) {
      this.sprite.material = this.lastDirectionSprite;
      this.lastDirectionSprite.map.offset.x = 0;
      this.lastDirectionSprite.map.offset.y = 0;
      this.lastDirectionSprite.map.repeat.set(GAME_CONSTANTS.FRAME_WIDTH, GAME_CONSTANTS.FRAME_HEIGHT);
    }
  }

  public resetToDownSprite() {
    this.sprite.material = this.materials.down;
    this.lastDirectionSprite = this.materials.down;
    this.materials.down.map.offset.x = 0;
    this.materials.down.map.offset.y = 0;
    this.materials.down.map.repeat.set(GAME_CONSTANTS.FRAME_WIDTH, GAME_CONSTANTS.FRAME_HEIGHT);
  }

  private updateSpriteFrame(spriteMaterial: SpriteMaterial) {
    const currentTime = performance.now();

    if (currentTime - this.lastFrameChangeTime > this.frameTime) {
      this.currentFrame = (this.currentFrame + 1) % this.totalFrames;
      this.lastFrameChangeTime = currentTime;

      const column = this.currentFrame % PLAYER_CONSTANTS.COLUMNS;
      const row = Math.floor(this.currentFrame / PLAYER_CONSTANTS.COLUMNS);

      spriteMaterial.map.offset.x = column * GAME_CONSTANTS.FRAME_WIDTH;
      spriteMaterial.map.offset.y = 1 - (row + 1) * GAME_CONSTANTS.FRAME_HEIGHT;
      spriteMaterial.map.repeat.set(GAME_CONSTANTS.FRAME_WIDTH, GAME_CONSTANTS.FRAME_HEIGHT);
    }
  }

  public animateWalkForward(direction: 'up' | 'down' | 'left' | 'right', distance: number = 8): Promise<void> {
    return new Promise((resolve) => {
      const startTime = performance.now();
      const duration = 600;

      const startPosition = {
        x: this.sprite.position.x,
        y: this.sprite.position.y
      };

      this.setDirection(direction);

      const animate = () => {
        const elapsed = performance.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);

        let deltaX = 0, deltaY = 0;
        switch (direction) {
          case 'up': deltaY = distance * progress; break;
          case 'down': deltaY = -distance * progress; break;
          case 'left': deltaX = -distance * progress; break;
          case 'right': deltaX = distance * progress; break;
        }

        this.sprite.position.set(
          startPosition.x + deltaX,
          startPosition.y + deltaY,
          this.sprite.position.z
        );

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          this.rest();
          resolve();
        }
      };

      requestAnimationFrame(animate);
    });
  }
}