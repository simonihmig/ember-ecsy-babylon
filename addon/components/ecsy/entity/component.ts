import Component from '@ember/component';
// @ts-ignore: Ignore import of compiled template
import layout from './template';
import { Entity, World } from 'ecsy';
import { assert } from '@ember/debug';

export default class EcsyEntity extends Component {
  layout = layout;

  entity!: Entity;

  // protected
  createEntity!: World['createEntity'];

  init() {
    super.init();

    assert('A `createEntity` function must be passed to `<Ecsy::Entity/>`', !!this.createEntity);

    this.entity = this.createEntity();
  }

  willDestroy(): void {
    this.entity.remove();
    // TODO: do we also remove all components from the entity?
  }
}
