import { ComponentConstructor, World, Component as _Component } from 'ecsy';
import { assert } from '@ember/debug';
import DomlessGlimmerComponent from '@kaliber5/ember-ecsy-babylon/components/domless-glimmer';
import EcsyEntity from '@kaliber5/ember-ecsy-babylon/components/ecsy/entity';

interface EcsyComponentArgs {
  // private
  parent: EcsyEntity;
  name: string;
}

export default class EcsyComponent extends DomlessGlimmerComponent<EcsyComponentArgs> {
  _Component!: ComponentConstructor<_Component>;

  constructor(owner: unknown, args: EcsyComponentArgs) {
    super(owner, args);

    const {
      parent,
      name,
      ...restArgs
    } = args;

    assert('Component reference `parent` is not passed. Please do not use this component directly.', !!parent);
    assert('Component reference `parent` is not an <Ecsy::Entity/>. Please do not use this component directly.', parent instanceof EcsyEntity);
    assert('Component reference `parent` does not have a valid `entity` set. Please do not use this component directly.', parent.entity);
    assert('`name` is not passed. Please do not use this component directly.', !!name);

    // @ts-ignore: private API
    const world = parent.entity._world as World;

    // @ts-ignore: private API
    const components = world.componentsManager.Components;
    this._Component = components[name];

    if (!this._Component) {
      throw new Error(`Component "${name}" not found.`);
    }

    parent.entity.addComponent(this._Component, restArgs);
  }

  didUpdate(changedArgs: object): void {
    super.didUpdate(changedArgs);

    const {
      parent,
      name,
      ...args
    } = this.args;

    const component = parent.entity.getMutableComponent(this._Component);
    Object.assign(component, args);
  }

  willDestroy(): void {
    super.willDestroy();

    if (this._Component) {
      this.args.parent.entity.removeComponent(this._Component);
    }
  }
}
