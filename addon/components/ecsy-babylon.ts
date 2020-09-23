import { EcsyArgs, EcsyContext } from 'ember-ecsy-babylon/components/ecsy';
import { BabylonCore, systems } from 'ecsy-babylon';
import { Entity, World } from 'ecsy';
import { guidFor } from '@ember/object/internals';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import * as components from 'ecsy-babylon/components';
import { assert } from '@ember/debug';
import { DEBUG } from '@glimmer/env';
import { Scene } from '@babylonjs/core/scene';
import DomlessGlimmerComponent from 'ember-ecsy-babylon/components/domless-glimmer';
import { mapComponentImports } from 'ember-ecsy-babylon';
import EcsyEntity from 'ember-ecsy-babylon/components/ecsy/entity';
import { scheduleOnce } from '@ember/runloop';

export interface EcsyBabylonContext extends EcsyContext {

  // @todo can we get rid of this? Is only available *after* ecsy has run, but context is already set. Mutating from outside is odd

  rootEntity: Entity;
}

export type EcsyBabylonDomlessGlimmerArgs = EcsyArgs<EcsyBabylonContext>;

const DEBUG_KEY = {
  altKey: false,
  ctrlKey: true,
  key: 'd'
}

export default class EcsyBabylon extends DomlessGlimmerComponent<EcsyBabylonContext, EcsyBabylonDomlessGlimmerArgs> {
  guid = guidFor(this);

  components = mapComponentImports(components);
  systems = systems;
  rootEntity?: Entity;

  world?: World;
  scene?: Scene;
  canvas?: HTMLCanvasElement;

  // use deliberately `any` here, as importing `DebugLayer` seems to also import all the code eagerly, which we obviously
  // don't want, although *here* it is only used as a type, but it is used as a *value* in toggleBabylonInspector below
  debugLayer?: any;

  @tracked ready = false;

  constructor(owner: unknown, args: EcsyBabylonDomlessGlimmerArgs) {
    super(owner, args);
  }

  @action
  onCanvasReady(): void {
    this.canvas = document.getElementById(`${this.guid}__canvas`) as HTMLCanvasElement;
    assert('Canvas element needed', this.canvas);

    this.ready = true;
  }

  @action
  onEcsyReady([world, entityComponent]: [World, EcsyEntity]): void {
    this.world = world;
    this.rootEntity = entityComponent.entity;
    scheduleOnce('afterRender', this, this.startEcsy);
  }

  private startEcsy(): void {
    this.world!.execute(0, 0);
    assert('No root entity found', this.rootEntity);
    const core = this.rootEntity.getComponent(BabylonCore);
    assert('Could not get BabylonCore component, something is broken!', core);
    this.scene = core.scene;

    if (DEBUG) {
      console.log('While focusing an ember-ecsy-babylon component, press CTRL-D to open the Babylon.js Inspector!');
    }
  }

  @action
  async toggleBabylonInspector(event: KeyboardEvent): Promise<void> {
    if (DEBUG) {
      if (
        this.scene
        && event.altKey === DEBUG_KEY.altKey
        && event.ctrlKey === DEBUG_KEY.ctrlKey
        && event.key === DEBUG_KEY.key
      ) {
        if (!this.debugLayer) {
          await import('@babylonjs/inspector');
          const { DebugLayer } = await import('@babylonjs/core/Debug/debugLayer');
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

    if (this.world) {
      this.world.execute(0, 0);
      this.world.stop();
    }
  }
}
