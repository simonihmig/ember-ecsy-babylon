import Component from '@ember/component';
// @ts-ignore: Ignore import of compiled template
import layout from './template';
import { Entity, World } from 'ecsy';
import { assert } from '@ember/debug';
import EntityComponent from 'ember-babylon/ecsy/components/entity';

function * ancestorsOf(component: Component) {
  // @ts-ignore: ignore private API usage
  let pointer = component.parentView;
  while (pointer) {
    yield pointer;
    pointer = pointer.parentView;
  }
}

export default class EcsyEntity extends Component {
  __ECSY_ENTITY__ = true;

  tagName = '';
  layout = layout;

  entity!: Entity;

  // protected
  createEntity!: World['createEntity'];

  didInsertElement() {
    super.didInsertElement();

    assert('A `createEntity` function must be passed to `<Ecsy::Entity/>`', !!this.createEntity);

    let parentEntity;
    for(const ancestorComponent of ancestorsOf(this)) {
      if (ancestorComponent.__ECSY_ENTITY__/* && !ancestorComponent._isDestroying*/) {
        if (!ancestorComponent.entity) {
          throw new Error('Parent Entity does not have a valid entity instance.');
        }

        parentEntity = ancestorComponent.entity;
        break;
      }
    }

    const entity = this.createEntity();
    entity.addComponent(EntityComponent, { parent: parentEntity });

    this.set('entity', entity);
  }

  willDestroy(): void {
    this.entity.remove();
  }
}
