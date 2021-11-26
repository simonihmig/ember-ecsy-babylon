import { Entity } from 'ecsy';
import { assert } from '@ember/debug';
import Parent from 'ecsy-babylon/components/parent';
import DomlessGlimmerComponent, {
  DomlessGlimmerArgs,
} from 'ember-ecsy-babylon/components/domless-glimmer';
import { EcsyContext } from 'ember-ecsy-babylon/components/ecsy';

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

interface EcsyEntityComponentsArgs extends DomlessGlimmerArgs<EcsyContext> {
  name?: string;
}

export default class EcsyEntity extends DomlessGlimmerComponent<
  EcsyContext,
  EcsyEntityComponentsArgs
> {
  entity!: Entity;

  constructor(owner: unknown, args: DomlessGlimmerArgs<EcsyContext>) {
    super(owner, args);

    const parentEntityComponent = findParentEntity(this);
    const parentEntity = parentEntityComponent
      ? parentEntityComponent.entity
      : undefined;

    assert(
      'Parent <Entity/> does not have a valid ECSY Entity component.',
      !parentEntityComponent || !!parentEntity
    );
    assert('No ECSY context found.', this.context);

    const entity = this.context!.world.createEntity(this.args.name);
    entity.addComponent(Parent, { value: parentEntity });

    this.entity = entity;
  }

  willDestroy(): void {
    super.willDestroy();

    this.entity.remove();
  }
}
