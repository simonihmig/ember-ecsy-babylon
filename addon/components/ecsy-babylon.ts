import Ecsy, { EcsyArgs, EcsyContext } from 'ember-ecsy-babylon/components/ecsy';
import { BabylonCore, systems } from 'ecsy-babylon';
import { Entity } from 'ecsy';
import { guidFor } from '@ember/object/internals';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import * as components from 'ecsy-babylon/components';
import { assert } from '@ember/debug';

export interface EcsyBabylonContext extends EcsyContext {
  rootEntity: Entity;
}

export type EcsyBabylonDomlessGlimmerArgs = EcsyArgs<EcsyBabylonContext>;

export default class EcsyBabylon extends Ecsy<EcsyBabylonContext, EcsyBabylonDomlessGlimmerArgs> {
  guid = guidFor(this);

  entity: Entity;
  @tracked ready = false;

  constructor(owner: unknown, args: EcsyBabylonDomlessGlimmerArgs) {
    super(owner, {
      ...args,
      components: args.components ?? new Map(Object.entries(components).filter(([key]) => key !== 'default')),
      systems: args.systems ?? systems,
    });
    this.entity = this.world.createEntity();
    this.context!.rootEntity = this.entity;
  }


  @action
  onCanvasReady(): void {
    const canvas = document.getElementById(`${this.guid}__canvas`) as HTMLCanvasElement;
    assert('Canvas element needed', canvas);

    this.entity.addComponent(BabylonCore, {
      world: this.world,
      canvas
    });

    this.ready = true;
    this.world.execute(0, 0);
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
