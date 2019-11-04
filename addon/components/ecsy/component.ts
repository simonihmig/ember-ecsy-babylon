import DomlessGlimmerComponent from 'ember-babylon/components/domless-glimmer/component';
import { World, ComponentConstructor, Component as EcsyComponent, SystemConstructor, System as EcsySystem } from 'ecsy';
import EntityComponent from 'ember-babylon/ecsy/components/entity';
import { assert } from '@ember/debug';

interface EcsyArgs {
  components: ComponentConstructor<EcsyComponent>[];
  systems: SystemConstructor<EcsySystem>[];
}

export default class Ecsy extends DomlessGlimmerComponent<EcsyArgs> {
  // private
  world!: World;
  createEntity!: World['createEntity'];

  constructor(owner: unknown, args: EcsyArgs) {
    super(owner, args);

    this.world = new World();
    this.createEntity = this.world.createEntity.bind(this.world);

    this.world.registerComponent(EntityComponent);

    assert('A components argument of type Array must be passed.', Array.isArray(this.args.components));
    assert('A systems argument of type Array must be passed.', Array.isArray(this.args.systems));

    this.args.components.forEach(c => this.world.registerComponent(c));
    this.args.systems.forEach(s => this.world.registerSystem(s));
  }
}
