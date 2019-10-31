import Component from '@ember/component';
// @ts-ignore: Ignore import of compiled template
import layout from './template';
import { Entity, World } from 'ecsy';
import { assert } from '@ember/debug';
import EntityComponent from 'ember-babylon/ecsy/components/entity';
import BaseComponent from 'ember-babylon/BaseComponent';

function findParentEntity(component: Component) {
  // @ts-ignore: ignore private API usage
  let pointer = component.parentView;
  while (pointer) {
    if (pointer.__ECSY_ENTITY__) {
      return pointer;
    }
    pointer = pointer.parentView;
  }
}

interface EcsyEntityArgs {
  createEntity: World['createEntity'];
}

export default class EcsyEntity extends BaseComponent<EcsyEntityArgs> {
  layout = layout;
  __ECSY_ENTITY__ = true;

  entity!: Entity;

  didInsertElement() {
    super.didInsertElement();

    assert('A `createEntity` function must be passed to `<Ecsy::Entity/>`', !!this.args.createEntity);

    const parentEntityComponent = findParentEntity(this);
    const parentEntity = parentEntityComponent ? parentEntityComponent.entity : null;

    assert('Parent <Entity/> does not have a valid ECSY Entity component.', (!parentEntityComponent || !!parentEntity));

    const entity = this.args.createEntity();
    entity.addComponent(EntityComponent, { parent: parentEntity });

    this.set('entity', entity);
  }

  willDestroy(): void {
    this.entity.remove();

    super.willDestroy();
  }
}
