import Ecsy from '../ecsy/component';
// @ts-ignore: Ignore import of compiled template
import layout from './template';
import { BabylonCore } from 'ember-babylon/ecsy-babylon/components';
import { Entity } from 'ecsy';
import { guidFor } from '@ember/object/internals';

export default class EcsyBabylon extends Ecsy {
  layout = layout;
  guid = guidFor(this);

  entity!: Entity;

  didInsertElement() {
    super.didInsertElement();

    const canvas = document.getElementById(`${this.guid}__canvas`);

    this.set('entity', this.world.createEntity());
    this.entity.addComponent(BabylonCore, {
      canvas
    });

    this.world.execute(0, 0);

    const core = this.entity.getComponent(BabylonCore);

    if (!core.engine) {
      throw new Error('Engine not found');
    }

    const startTime = (new Date()).getTime();
    core.engine.runRenderLoop((): void => {
      if (!core.engine || !core.scene) {
        throw new Error('Engine and/or Scene not found');
      }

      this.world.execute(core.engine.getDeltaTime(), (new Date()).getTime() - startTime);
      core.scene.render();
    });
  }

  willDestroy(): void {
    this.world.stop();
    this.entity.remove();

    super.willDestroy();
  }
}
