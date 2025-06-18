export type KeyCode = 'KeyW' | 'KeyA' | 'KeyS' | 'KeyD';

export class InputHandler {
  private keys: Record<KeyCode, boolean> = {
    KeyW: false,
    KeyA: false,
    KeyS: false,
    KeyD: false
  };
  
  public lastKeyPressed?: KeyCode;

  constructor() {
    this.setupEventListeners();
  }

  private setupEventListeners() {
    window.addEventListener('keydown', (event) => {
      if (this.keys.hasOwnProperty(event.code)) {
        this.keys[event.code as KeyCode] = true;
        this.lastKeyPressed = event.code as KeyCode;
      }
    });
    
    window.addEventListener('keyup', (event) => {
      if (this.keys.hasOwnProperty(event.code)) {
        this.keys[event.code as KeyCode] = false;
      }
    });
  }

  public isKeyPressed(key: KeyCode): boolean {
    return this.keys[key];
  }

  public isAnyKeyPressed(): boolean {
    return Object.values(this.keys).some(pressed => pressed);
  }

  public getKeys(): Record<KeyCode, boolean> {
    return { ...this.keys };
  }
}