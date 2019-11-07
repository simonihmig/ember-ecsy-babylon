import Controller from '@ember/controller';
import components from 'ember-babylon/ecsy-babylon/components';
import systems from 'ember-babylon/ecsy-babylon/systems';
import { action } from '@ember/object';

function foo() {
  return 1;
}

export default class Application extends Controller {
  components = components;
  systems = systems;
  rotateValue = 45;
  showEntity = false;
  foo_bar = true;

  @action
  rotate(direction: 'right' | 'left', degrees: number) {
    this.set('rotateValue', direction === 'left' ? this.rotateValue - degrees : this.rotateValue + degrees);
    return foo();
  }

  @action
  toggleEntity() {
    this.set('showEntity', !this.showEntity);
  }
}
