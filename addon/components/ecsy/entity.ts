import { Entity } from 'ecsy';
import { assert } from '@ember/debug';
import EntityComponent from '@kaliber5/ember-ecsy-babylon/ecsy/components/entity';
import DomlessGlimmerComponent, { DomlessGlimmerArgs } from '@kaliber5/ember-ecsy-babylon/components/domless-glimmer';

function findParentEntity(component: EcsyEntity): EcsyEntity | null {
  let pointer = component.args.parent;
  while (pointer) {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    if (pointer instanceof EcsyEntity) {
      return pointer;
    }
    pointer = pointer.args.parent;
  }

  return null;
}

export default class EcsyEntity extends DomlessGlimmerComponent<DomlessGlimmerArgs> {
  entity!: Entity;

  constructor(owner: unknown, args: DomlessGlimmerArgs) {
    super(owner, args);

    assert('A "w" argument containing a "createEntity" function must be passed to `<Ecsy::Entity/>`', !!args.w.private.createEntity);

    const parentEntityComponent = findParentEntity(this);
    const parentEntity = parentEntityComponent ? parentEntityComponent.entity : null;

    assert('Parent <Entity/> does not have a valid ECSY Entity component.', (!parentEntityComponent || !!parentEntity));

    const entity = args.w.private.createEntity();
    entity.addComponent(EntityComponent, { parent: parentEntity });

    this.entity = entity;
  }

  willDestroy(): void {
    super.willDestroy();

    this.entity.remove();
  }
}
