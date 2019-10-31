import BaseComponent from 'ember-babylon/BaseComponent';
// @ts-ignore: Ignore import of compiled template
import layout from './template';
import { World, ComponentConstructor, Component as EcsyComponent, SystemConstructor, System as EcsySystem } from 'ecsy';
import EntityComponent from 'ember-babylon/ecsy/components/entity';
import { assert } from '@ember/debug';

interface EcsyArgs {
  components: ComponentConstructor<EcsyComponent>[];
  systems: SystemConstructor<EcsySystem>[];
}

export default class Ecsy extends BaseComponent<EcsyArgs> {
  layout = layout;

  // private
  world!: World;
  createEntity!: World['createEntity'];

  didInsertElement() {
    super.didInsertElement();

    this.set('world', new World());
    this.set('createEntity', this.world.createEntity.bind(this.world));

    this.world.registerComponent(EntityComponent);

    assert('A components argument of type Array must be passed.', Array.isArray(this.args.components));
    assert('A systems argument of type Array must be passed.', Array.isArray(this.args.systems));

    this.args.components.forEach(c => this.world.registerComponent(c));
    this.args.systems.forEach(s => this.world.registerSystem(s));
  }
}
