import DomlessGlimmerComponent, { DomlessGlimmerArgs } from 'ember-ecsy-babylon/components/domless-glimmer';
import { Component as EcsyComponent, ComponentConstructor, System as EcsySystem, SystemConstructor, World } from 'ecsy';
import { assert } from '@ember/debug';

export interface EcsyArgs extends DomlessGlimmerArgs<EcsyContext> {
  components: ComponentConstructor<EcsyComponent>[];
  systems: SystemConstructor<EcsySystem>[];
}


export interface EcsyContext {
  world: World;
}

export default class Ecsy extends DomlessGlimmerComponent<EcsyContext, EcsyArgs> {
  // private
  world!: World;

  constructor(owner: unknown, args: EcsyArgs) {
    super(owner, args);

    this.world = new World();

    assert('A `components` argument of type Array must be passed.', Array.isArray(this.args.components));
    assert('A `systems` argument of type Array must be passed.', Array.isArray(this.args.systems));

    this.args.components.forEach(c => this.world.registerComponent(c));
    this.args.systems.forEach(s => this.world.registerSystem(s));

    this.context = { world: this.world };
  }
}
