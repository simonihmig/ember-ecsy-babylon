import { ComponentConstructor, Entity, World } from 'ecsy';
import { assert } from '@ember/debug';
import { Component as _Component } from 'ecsy';
import BaseComponent from 'ember-babylon/BaseComponent';

interface EcsyComponentArgs {
  // private
  E: Entity;
  name: string;
}

export default class EcsyComponent extends BaseComponent<EcsyComponentArgs> {
  _Component!: ComponentConstructor<_Component>;

  didInsertElement() {
    super.didInsertElement();

    const {
      E,
      name,
      ...args
    } = this.args;

    assert('Entity `E` is not passed. Please do not use this component directly.', !!E);
    assert('`name` is not passed. Please do not use this component directly.', !!name);

    // @ts-ignore: private API
    const world = this.E._world as World;

    // @ts-ignore: private API
    const components = world.componentsManager.Components;
    this._Component = components[name];

    if (!this._Component) {
      throw new Error(`Component "${name}" not found.`);
    }

    E.addComponent(this._Component, args);
  }

  didUpdateAttrs(): void {
    super.didUpdateAttrs();

    const {
      E,
      name,
      ...args
    } = this.args;

    const component = E.getMutableComponent(this._Component);
    Object.assign(component, args);
  }

  willDestroy(): void {
    if (this._Component) {
      this.args.E.removeComponent(this._Component);
    }

    super.willDestroy();
  }
}
