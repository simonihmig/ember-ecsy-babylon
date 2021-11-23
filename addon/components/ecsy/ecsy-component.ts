import { Component as _Component, ComponentConstructor } from 'ecsy';
import { assert } from '@ember/debug';
import DomlessGlimmerComponent from 'ember-ecsy-babylon/components/domless-glimmer';
import EcsyEntity from 'ember-ecsy-babylon/components/ecsy/entity';
import { EcsyContext } from 'ember-ecsy-babylon/components/ecsy';

interface EcsyComponentArgs {
  // private
  parent: EcsyEntity;
  name: string;
}

export default class EcsyComponent extends DomlessGlimmerComponent<
  EcsyContext,
  EcsyComponentArgs
> {
  _Component!: ComponentConstructor<_Component<unknown>>;

  constructor(owner: unknown, args: EcsyComponentArgs) {
    super(owner, args);

    const { parent, name, ...restArgs } = args;

    assert(
      'Component reference `parent` is not passed. Please do not use this component directly.',
      !!parent
    );
    assert(
      'Component reference `parent` is not an <Ecsy::Entity/>. Please do not use this component directly.',
      parent instanceof EcsyEntity
    );
    assert(
      'Component reference `parent` does not have a valid `entity` set. Please do not use this component directly.',
      parent.entity
    );
    assert(
      '`name` is not passed. Please do not use this component directly.',
      !!name
    );

    assert('Missing context for EcsyComponent', this.context);
    const components = this.context!.components;

    if (!components.has(name)) {
      throw new Error(
        `Ecsy component "${name}" not found. Available component names: ${Array.from(
          components.keys()
        ).join(', ')}`
      );
    }

    this._Component = components.get(name)!;
    parent.entity.addComponent(this._Component, restArgs);
  }

  didUpdate(changedArgs: object): void {
    super.didUpdate(changedArgs);

    const { parent } = this.args;

    const schema = this._Component.schema;
    const component = parent.entity.getMutableComponent(this._Component);
    assert(`No component "${this.args.name}" found to update.`, component);

    for (const [key, value] of Object.entries(changedArgs)) {
      const prop = schema[key];
      if (prop) {
        component[key as keyof _Component<unknown>] = prop.type.copy(value, component[key as keyof _Component<unknown>]);
      } else {
        component[key as keyof _Component<unknown>] = value;
      }
    }
  }

  willDestroy(): void {
    super.willDestroy();

    if (this._Component) {
      this.args.parent.entity.removeComponent(this._Component);
    }
  }
}
