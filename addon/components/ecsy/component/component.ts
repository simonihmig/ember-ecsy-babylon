import { ComponentConstructor, Entity, World } from 'ecsy';
import { assert } from '@ember/debug';
import { Component as _Component } from 'ecsy';
import { setProperties } from '@ember/object';
import BaseComponent from 'ember-babylon/BaseComponent';

export default class EcsyComponent extends BaseComponent<any> {
  tagName = '';

  // protected
  E!: Entity;
  name!: string;

  // private
  _Component!: ComponentConstructor<_Component>;

  init() {
    super.init();

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
    this._Component = components[this.name];

    if (!this._Component) {
      throw new Error(`Component "${this.name}" not found.`);
    }

    E.addComponent(this._Component, args);
  }

  didUpdateAttrs(): void {
    const {
      E,
      name,
      ...args
    } = this.args;

    const component = this.E.getMutableComponent(this._Component);
    setProperties(component, args);
  }

  willDestroy(): void {
    if (this._Component) {
      this.E.removeComponent(this._Component);
    }
  }
}
