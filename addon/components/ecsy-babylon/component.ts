import Ecsy from '../ecsy/component';
import { BabylonCore } from 'ember-babylon/ecsy-babylon/components';
import { Entity } from 'ecsy';
import { guidFor } from '@ember/object/internals';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class EcsyBabylon extends Ecsy {
  guid = guidFor(this);

  @tracked entity!: Entity;

  @action
  onCanvasReady() {
    const canvas = document.getElementById(`${this.guid}__canvas`);

    this.entity = this.world.createEntity();
    this.entity.addComponent(BabylonCore, {
      canvas
    });

    this.world.execute(0, 0);

    const core = this.entity.getComponent(BabylonCore);

    if (!core.engine) {
      throw new Error('Engine not found');
    }

    const startTime = performance.now();
    core.engine.runRenderLoop((): void => {
      if (!core.engine || !core.scene) {
        throw new Error('Engine and/or Scene not found');
      }

      this.world.execute(core.engine.getDeltaTime(), performance.now() - startTime);
      core.scene.render();
    });
  }

  willDestroy(): void {
    this.world.stop();
    this.entity.remove();

    super.willDestroy();
  }
}
