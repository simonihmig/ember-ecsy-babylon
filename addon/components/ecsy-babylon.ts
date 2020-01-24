import Ecsy, { EcsyArgs, EcsyContext } from 'ember-ecsy-babylon/components/ecsy';
import { BabylonCore } from 'ember-ecsy-babylon/ecsy-babylon/components';
import { Entity } from 'ecsy';
import { guidFor } from '@ember/object/internals';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { DomlessGlimmerArgs } from 'ember-ecsy-babylon/components/domless-glimmer';

export interface EcsyBabylonContext extends EcsyContext {
  rootEntity: Entity;
}

export type EcsyBabylonDomlessGlimmerArgs = DomlessGlimmerArgs<EcsyBabylonContext>;

export default class EcsyBabylon extends Ecsy {
  guid = guidFor(this);

  entity: Entity;
  @tracked ready = false;

  context: EcsyBabylonContext;

  constructor(owner: unknown, args: EcsyArgs) {
    super(owner, args);
    this.entity = this.world.createEntity();
    this.context = {
      world: this.world,
      rootEntity: this.entity
    };
  }


  @action
  onCanvasReady() {
    const canvas = document.getElementById(`${this.guid}__canvas`);

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
