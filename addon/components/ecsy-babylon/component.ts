import Component from '@ember/component';
// @ts-ignore: Ignore import of compiled template
import layout from './template';
import { BabylonCore } from 'ember-babylon/ecsy/components';
import { Entity, World } from 'ecsy';
import { guidFor } from '@ember/object/internals';

export default class EcsyBabylon extends Component {
  tagName = '';
  layout = layout;
  guid = guidFor(this);

  entity!: Entity;
  world!: World;

  didInsertElement() {
    super.didInsertElement();

    const canvas = document.getElementById(`${this.guid}__canvas`);

    this.set('entity', this.world.createEntity());
    this.entity.addComponent(BabylonCore, {
      canvas
    });

    this.world.execute(0.1, 0);

    const core = this.entity.getComponent(BabylonCore);
    const startTime = (new Date()).getTime();

    if (!core.engine) {
      throw new Error('Engine not found');
    }

    core.engine.runRenderLoop((): void => {
      if (!core.engine || !core.scene) {
        throw new Error('Engine and/or Scene not found');
      }

      core.scene.render();
      this.world.execute(core.engine.getDeltaTime(), (new Date()).getTime() - startTime);
    });
  }

  willDestroy(): void {
    this.world.stop();
    // this.entity.removeAllComponents(); // TODO: is this necessary?
    this.entity.remove();
  }
}
