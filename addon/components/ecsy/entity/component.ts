import Component from '@ember/component';
import { Entity, World } from 'ecsy';
import { assert } from '@ember/debug';
import EntityComponent from 'ember-babylon/ecsy/components/entity';
import DomlessGlimmerComponent from 'ember-babylon/components/domless-glimmer/component';

// TODO: we use parent for our own ref
function findParentEntity(component: Component | DomlessGlimmerComponent) {
  // @ts-ignore: ignore private API usage
  let pointer = component.parentView || component.args.parent;
  while (pointer) {
    if (pointer.__ECSY_ENTITY__) {
      return pointer;
    }
    pointer = pointer.parentView || component.args.parent;
  }
}

interface EcsyEntityArgs {
  createEntity: World['createEntity'];
}

export default class EcsyEntity extends DomlessGlimmerComponent<EcsyEntityArgs> {
  __ECSY_ENTITY__ = true;

  entity!: Entity;

  constructor(owner: unknown, args: EcsyEntityArgs) {
    super(owner, args);

    console.log('entity parent', args.parent);

    assert('A `createEntity` function must be passed to `<Ecsy::Entity/>`', !!this.args.createEntity);

    const parentEntityComponent = findParentEntity(this);
    console.log('ancestor entity', parentEntityComponent);
    const parentEntity = parentEntityComponent ? parentEntityComponent.entity : null;

    assert('Parent <Entity/> does not have a valid ECSY Entity component.', (!parentEntityComponent || !!parentEntity));

    const entity = this.args.createEntity();
    entity.addComponent(EntityComponent, { parent: parentEntity });

    this.entity = entity;
  }

  willDestroy(): void {
    this.entity.remove();

    super.willDestroy();
  }
}
