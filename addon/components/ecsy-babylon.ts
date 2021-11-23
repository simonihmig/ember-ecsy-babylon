import Ecsy, {
  EcsyArgs,
  EcsyContext,
} from 'ember-ecsy-babylon/components/ecsy';
import BabylonCore from 'ecsy-babylon/components/babylon-core';
import { Entity } from 'ecsy';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { assert } from '@ember/debug';
import { DEBUG } from '@glimmer/env';
import { Scene } from '@babylonjs/core/scene';
import { EngineOptions } from '@babylonjs/core/Engines/thinEngine';
import { Engine } from '@babylonjs/core/Engines/engine';

export interface EcsyBabylonContext extends EcsyContext {
  rootEntity: Entity;
}

export interface EcsyBabylonDomlessGlimmerArgs
  extends EcsyArgs<EcsyBabylonContext> {
  engineOptions?: EngineOptions;
  antialias?: boolean;
  adaptToDeviceRatio?: boolean;
}

const DEBUG_KEY = {
  altKey: false,
  ctrlKey: true,
  key: 'd',
};

export default class EcsyBabylon extends Ecsy<
  EcsyBabylonContext,
  EcsyBabylonDomlessGlimmerArgs
> {
  entity: Entity;
  scene?: Scene;
  engine?: Engine;

  // use deliberately `any` here, as importing `DebugLayer` seems to also import all the code eagerly, which we obviously
  // don't want, although *here* it is only used as a type, but it is used as a *value* in toggleBabylonInspector below
  debugLayer?: any;

  @tracked ready = false;

  constructor(owner: unknown, args: EcsyBabylonDomlessGlimmerArgs) {
    super(owner, args);
    this.entity = this.world.createEntity();
    this.context!.rootEntity = this.entity;
  }

  @action
  onCanvasReady(canvas: HTMLCanvasElement): void {
    const engine = new Engine(
      canvas,
      this.args.antialias,
      this.args.engineOptions,
      this.args.adaptToDeviceRatio
    );
    engine.canvasTabIndex = 0;

    this.entity.addComponent(BabylonCore, {
      world: this.world,
      canvas,
      engine,
    });

    this.ready = true;
    this.world.execute(0, 0);
    const core = this.entity.getComponent(BabylonCore);
    assert('Could not get BabylonCore component, something is broken!', core);
    this.scene = core.scene;
    this.engine = engine;

    if (DEBUG) {
      console.log(
        'While focusing an ember-ecsy-babylon component, press CTRL-D to open the Babylon.js Inspector!'
      );
    }
  }

  @action
  resize() {
    this.engine?.resize();
  }

  @action
  async toggleBabylonInspector(event: KeyboardEvent): Promise<void> {
    if (DEBUG) {
      if (
        this.scene &&
        event.altKey === DEBUG_KEY.altKey &&
        event.ctrlKey === DEBUG_KEY.ctrlKey &&
        event.key === DEBUG_KEY.key
      ) {
        if (!this.debugLayer) {
          await import('@babylonjs/inspector');
          const { DebugLayer } = await import(
            '@babylonjs/core/Debug/debugLayer'
          );
          this.debugLayer = new DebugLayer(this.scene);
        }

        if (this.debugLayer.isVisible()) {
          this.debugLayer.hide();
        } else {
          await this.debugLayer.show();
        }
      }
    }
  }

  willDestroy(): void {
    super.willDestroy();

    const entity = this.entity;

    if (entity) {
      entity.remove();
    }

    this.world.execute(0, 0);
    this.world.stop();
  }
}
