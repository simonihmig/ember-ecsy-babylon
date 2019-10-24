import Component from '@ember/component';
// @ts-ignore: Ignore import of compiled template
import layout from './template';
import {World, ComponentConstructor, Component as EcsyComponent, SystemConstructor, System as EcsySystem } from 'ecsy';

export default class Ecsy extends Component {
  layout = layout;

  // public
  components: ComponentConstructor<EcsyComponent>[] = [];
  systems: SystemConstructor<EcsySystem>[] = [];

  // private
  world!: World;
  createEntity!: World['createEntity'];

  init() {
    super.init();

    this.world = new World();
    this.createEntity = this.world.createEntity.bind(this.world);

    this.components.map(c => this.world.registerComponent(c));
    this.systems.map(s => this.world.registerComponent(s));

    // TODO: execute this world
  }
}
