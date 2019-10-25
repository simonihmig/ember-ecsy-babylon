import Component from '@ember/component';
// @ts-ignore: Ignore import of compiled template
import layout from './template';
import { Entity, World } from 'ecsy';
import { assert } from '@ember/debug';

export default class EcsyEntity extends Component {
  tagName = '';
  layout = layout;

  entity!: Entity;

  // protected
  createEntity!: World['createEntity'];

  didInsertElement() {
    super.didInsertElement();

    assert('A `createEntity` function must be passed to `<Ecsy::Entity/>`', !!this.createEntity);

    this.set('entity', this.createEntity());
  }

  willDestroy(): void {
    // TODO: do we also remove all components from the entity?
    this.entity.remove();
  }
}
