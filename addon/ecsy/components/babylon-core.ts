import { Camera, Engine, Scene } from '@babylonjs/core';


export default class BabylonCore {
  canvas?: HTMLCanvasElement;
  defaultCamera?: Camera;
  engine?: Engine;
  scene?: Scene;

  getCanvas() {
    if (!this.canvas) {
      throw new Error('Canvas not initialized');
    }

    return this.canvas;
  }

  getEngine() {
    if (!this.engine) {
      throw new Error('Engine not initialized');
    }

    return this.engine;
  }
}
