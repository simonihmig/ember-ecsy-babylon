import { ComponentConstructor, Entity, System } from 'ecsy';
import { ArcRotateCamera, BabylonCore } from '../components';
import {ArcRotateCamera as BabylonArcRotateCamera, Camera, Scene} from '@babylonjs/core';
import { guidFor } from '@ember/object/internals';

export default class PrimitiveSystem extends System {
  execute() {
    // TODO: abstract this core querying in a BaseSystem class
    // TODO: this should really exist only once, add check if multiple cores are found
    this.queries.core.added.forEach((e: Entity) => {
      this.core = e.getComponent(BabylonCore);
    });
    this.queries.core.removed.forEach(() => {
      this.core = undefined;
    });

    if(!this.core || !this.core.scene || !this.core.canvas) {
      throw new Error('No BabylonCore Component found. Have you instantiated the right Root Ecsy component?');
    }

    const {
      scene,
      canvas,
      defaultCamera
    } = this.core;

    this.queries.arcRotateCamera.added.forEach((e: Entity) => this.setupArcRotateCamera(e, scene, canvas));
    this.queries.arcRotateCamera.changed.forEach((e: Entity) => this.update(e, ArcRotateCamera));
    this.queries.arcRotateCamera.removed.forEach((e: Entity) => this.remove(e, ArcRotateCamera, scene, canvas, defaultCamera));
  }

  setupArcRotateCamera(entity: Entity, scene: Scene, canvas: HTMLCanvasElement) {
    const cameraComponent = entity.getComponent(ArcRotateCamera);

    const {
      value,
      ...args
    } = cameraComponent;

    const {
      alpha,
      beta,
      radius,
      target
    } = args;

    const instance = value
      ? value
      : new BabylonArcRotateCamera(`${guidFor(entity)}__ArcRotateCamera`, alpha, beta, radius, target, scene, false);

    Object.assign(instance, args);
    cameraComponent.value = instance;

    scene.activeCamera = instance;
    scene.activeCamera.attachControl(canvas, false);
  }

  update(entity: Entity, component: ComponentConstructor<any>) {
    const cameraComponent = entity.getComponent(component);

    const {
      value,
      ...args
    } = cameraComponent;

    Object.assign(value, args);
  }

  remove(entity: Entity, component: ComponentConstructor<any>, scene: Scene, canvas: HTMLCanvasElement, defaultCamera: Camera) {
    const cameraComponent = entity.getRemovedComponent(component);

    // TODO: We might need something smarter here in the future, what if there's multiple camera entities?
    // set defaultCamera as current active camera if it exists
    scene.activeCamera = defaultCamera || null;

    if (scene.activeCamera) {
      // restore control if there is still an active camera
      scene.activeCamera.attachControl(canvas, false);
    }

    if (cameraComponent.value) {
      cameraComponent.value.dispose();
    }
  }
}

PrimitiveSystem.queries = {
  core: {
    components: [BabylonCore],
    listen: {
      added: true,
      removed: true
    }
  },
  arcRotateCamera: {
    components: [ArcRotateCamera],
    listen: {
      added: true,
      changed: true,
      removed: true
    }
  },
};
