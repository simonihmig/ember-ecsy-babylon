import Component from '@ember/component';
// @ts-ignore: Ignore import of compiled template
import layout from './template';
import {World, ComponentConstructor, Component as EcsyComponent, SystemConstructor, System as EcsySystem } from 'ecsy';

export default class Ecsy extends Component {
  tagName = '';
  layout = layout;

  // public
  components: ComponentConstructor<EcsyComponent>[] = [];
  systems: SystemConstructor<EcsySystem>[] = [];

  // private
  world!: World;
  createEntity!: World['createEntity'];

  didInsertElement() {
    super.didInsertElement();

    this.set('world', new World());
    this.set('createEntity', this.world.createEntity.bind(this.world));

    this.components.forEach(c => this.world.registerComponent(c));
    this.systems.forEach(s => this.world.registerSystem(s));
  }
}
