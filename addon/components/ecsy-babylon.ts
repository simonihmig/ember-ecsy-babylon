import Ecsy from '@kaliber5/ember-ecsy-babylon/components/ecsy';
import { BabylonCore } from '@kaliber5/ember-ecsy-babylon/ecsy-babylon/components';
import { Entity } from 'ecsy';
import { guidFor } from '@ember/object/internals';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class EcsyBabylon extends Ecsy {
  guid = guidFor(this);

  @tracked entity?: Entity;

  @action
  onCanvasReady() {
    const canvas = document.getElementById(`${this.guid}__canvas`);

    this.entity = this.world.createEntity();
    this.entity.addComponent(BabylonCore, {
      world: this.world,
      canvas
    });

    this.world.execute(0, 0);
  }

  willDestroy(): void {
    super.willDestroy();

    const entity = this.entity;

    if (entity) {
      this.entity = undefined;
      entity.remove();
    }

    this.world.execute(0, 0);
    this.world.stop();
  }
}
