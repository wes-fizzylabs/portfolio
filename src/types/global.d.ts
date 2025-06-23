/// <reference types="react" />

// Global type declarations for modules without types

declare module 'three' {
  export class Mesh {
    constructor(geometry?: any, material?: any);
    position: { x: number; y: number; z: number; set(x: number, y: number, z: number): void; copy(v: any): void };
    scale: { x: number; y: number; z: number; set(x: number, y: number, z: number): void };
    material: any;
    renderOrder: number;
  }

  export class Sprite {
    constructor(material?: any);
    position: { x: number; y: number; z: number; set(x: number, y: number, z: number): void };
    scale: { x: number; y: number; z: number; set(x: number, y: number, z: number): void };
    material: any;
  }

  export class SpriteMaterial {
    constructor(parameters?: any);
    map: any;
  }

  export class TextureLoader {
    load(url: string): any;
  }

  export class Scene {
    add(object: any): void;
  }

  export class PlaneGeometry {
    constructor(width?: number, height?: number);
  }

  export class MeshBasicMaterial {
    constructor(parameters?: any);
    opacity: number;
  }

  export class Color {
    constructor(color?: any);
  }

  export class WebGLRenderer {
    constructor(parameters?: any);
    render(scene: any, camera: any): void;
  }

  export class OrthographicCamera {
    constructor(left?: number, right?: number, top?: number, bottom?: number, near?: number, far?: number);
  }
}

declare module 'react' {
  export interface Component<P = {}, S = {}> { }
  export interface FC<P = {}> {
    (props: P): any;
  }
  export const createElement: any;
  export default any;
}

declare module 'react/jsx-runtime' {
  export const jsx: any;
  export const jsxs: any;
  export const Fragment: any;
}