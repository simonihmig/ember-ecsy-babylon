import Component from '@ember/component';
import { Scene } from '@babylonjs/core';
import { guidFor } from '@ember/object/internals';

function * ancestorsOf(component: Component) {
  // @ts-ignore: Ignore missing private API typing
  let pointer = component.parentView;
  while (pointer) {
    yield pointer;
    pointer = pointer.parentView;
  }
}

export default class ModelViewerBaseComponent extends Component {
  // protected
  scene!: Scene;

  didInsertElement(): void {
    for (const a of ancestorsOf(this)) {
      if (a.__IS_BABYLON_SCENE__) {
        this.scene = a.scene;
        break;
      }
    }

    if (!this.scene) {
      throw new Error('Could not find parent scene. Are you sure there is a <BabylonScene/> ancestor?')
    }
  }

  get guid(): string {
    return guidFor(this);
  }

  willDestroyElement(): void {
    this.cleanup();
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  cleanup(): void {

  }
}
