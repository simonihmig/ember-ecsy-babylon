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

    // const core = this.entity.getComponent(BabylonCore);
    //
    // if (!core.engine) {
    //   throw new Error('Engine not found');
    // }
    //
    // const startTime = performance.now();
    // core.engine.runRenderLoop((): void => {
    //   if (!core.engine || !core.scene) {
    //     throw new Error('Engine and/or Scene not found');
    //   }
    //
    //   this.world.execute(core.engine.getDeltaTime(), performance.now() - startTime);
    //
    //   // only render if there is an active camera
    //   if (core.scene.activeCamera) {
    //     core.scene.render();
    //   }
    // });
  }

  willDestroy(): void {
    super.willDestroy();

    const entity = this.entity;
    console.log('disposing');

    if (entity) {
      console.log('removing entity');
      this.entity = undefined;
      entity.remove();
    }

    this.world.execute(0, 0);
    this.world.stop();
  }
}
