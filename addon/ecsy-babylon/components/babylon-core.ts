import { Camera, Engine, Scene } from '@babylonjs/core';
import { createComponentClass, Component, World } from 'ecsy';

export interface BabylonCoreComponent extends Component {
  world: World;
  canvas: HTMLCanvasElement;
  defaultCamera: Camera;
  engine: Engine;
  scene: Scene;
}

export default createComponentClass<BabylonCoreComponent>({
  world: { default: null },
  canvas: { default: null },
  defaultCamera: { default: null },
  engine: { default: null },
  scene: { default: null },
}, 'BabylonCore');
