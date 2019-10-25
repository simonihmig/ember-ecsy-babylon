import { Camera, Engine, Scene } from '@babylonjs/core';
import { createComponentClass, Component } from 'ecsy';

interface BabylonCoreComponent extends Component {
  canvas: HTMLCanvasElement;
  defaultCamera: Camera;
  engine: Engine;
  scene: Scene;
}

export default createComponentClass<BabylonCoreComponent>({
  canvas: { default: null },
  defaultCamera: { default: null },
  engine: { default: null },
  scene: { default: null },
}, 'BabylonCore');
