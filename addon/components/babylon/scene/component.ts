import Component from '@ember/component';
// @ts-ignore: Ignore import of compiled template
import layout from './template';
// @ts-ignore
import styles from './styles';
// @ts-ignore
import config from 'ember-get-config';
import { ArcRotateCamera, Engine, Scene, Vector3 } from '@babylonjs/core';
import { action } from '@ember/object';

export default class BabylonScene extends Component {
  __IS_BABYLON_SCENE__ = true;

  layout = layout;

  resize = true;
  debounce = 0;

  // private
  canvas?: HTMLCanvasElement;
  engine?: Engine;
  scene?: Scene;

  didInsertElement(): void {
    if(config.environment === 'test'){
      return;
    }

    // @ts-ignore
    const canvas = this.element.querySelector(`.${styles['canvas']}`) as HTMLCanvasElement;

    // normal rendering
    const engine = new Engine(canvas, true);

    const scene = new Scene(engine);
    this.setProperties({
      canvas,
      engine,
      scene
    });

    new ArcRotateCamera('defaultCamera', 0, 0.8, 100, new Vector3(0, 0, 0), scene);

    // TODO: detect if a camera exists for the scene, otherwise don't run or stop the render loop
    engine.runRenderLoop((): void => {
      scene.render();
    });
  }

  @action
  onResize() {
    if(this.resize && this.engine) {
      this.engine.resize();
    }
  }
}
