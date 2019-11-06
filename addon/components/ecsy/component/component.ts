import { ComponentConstructor, Entity, World } from 'ecsy';
import { assert } from '@ember/debug';
import { Component as _Component } from 'ecsy';
import DomlessGlimmerComponent from "ember-babylon/components/domless-glimmer/component";
import EcsyEntity from "ember-babylon/components/ecsy/entity/component";

interface EcsyComponentArgs {
  // private
  E: Entity;
  parent: EcsyEntity;
  name: string;
}

export default class EcsyComponent extends DomlessGlimmerComponent<EcsyComponentArgs> {
  _Component!: ComponentConstructor<_Component>;

  constructor(owner: unknown, args: EcsyComponentArgs) {
    super(owner, args);

    const {
      E,
      parent,
      name,
      ...restArgs
    } = args;

    assert('Entity `E` is not passed. Please do not use this component directly.', !!E);
    assert('Component reference `parent` is not passed. Please do not use this component directly.', !!parent);
    assert('Component reference `parent` is not an <Ecsy::Entity/>. Please do not use this component directly.', parent instanceof EcsyEntity);
    assert('`name` is not passed. Please do not use this component directly.', !!name);

    // @ts-ignore: private API
    const world = E._world as World;

    // @ts-ignore: private API
    const components = world.componentsManager.Components;
    this._Component = components[name];

    if (!this._Component) {
      throw new Error(`Component "${name}" not found.`);
    }

    E.addComponent(this._Component, restArgs);
  }

  didUpdate(): void {
    super.didUpdate();

    const {
      E,
      parent,
      name,
      ...args
    } = this.args;

    const component = E.getMutableComponent(this._Component);
    Object.assign(component, args);
  }

  willDestroy(): void {
    super.willDestroy();

    if (this._Component) {
      this.args.E.removeComponent(this._Component);
    }
  }
}
