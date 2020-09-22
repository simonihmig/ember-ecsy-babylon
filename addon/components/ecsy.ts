import DomlessGlimmerComponent, { DomlessGlimmerArgs } from 'ember-ecsy-babylon/components/domless-glimmer';
import { Component as EcsyComponent, ComponentConstructor, System as EcsySystem, SystemConstructor, World } from 'ecsy';
import { assert } from '@ember/debug';
import { Parent } from 'ecsy-babylon';

export interface EcsyArgs<C extends EcsyContext> extends DomlessGlimmerArgs<C> {
  components: Map<string, ComponentConstructor<EcsyComponent<unknown>>>;
  systems: SystemConstructor<EcsySystem>[];
}

export interface EcsyContext {
  world: World;
  components: Map<string, ComponentConstructor<EcsyComponent<unknown>>>;
}

export default class Ecsy<C extends EcsyContext, A extends EcsyArgs<C>> extends DomlessGlimmerComponent<C, A> {
  world: World;

  constructor(owner: unknown, args: A) {
    super(owner, args);

    const { components, systems } = this.args;
    this.world = new World();

    assert('A `components` argument of type Map must be passed.', components instanceof Map);
    assert('A `systems` argument of type Array must be passed.', Array.isArray(systems));

    components.forEach(c => this.world.registerComponent(c));
    // we always need a Parent component (at least for ecsy-babylon, could be refactored when supporting generic ecsy usage)
    if (!this.world.hasRegisteredComponent(Parent)) {
      this.world.registerComponent(Parent);
    }
    systems.forEach(s => this.world.registerSystem(s));

    this.context = { world: this.world, components } as C;
  }
}
