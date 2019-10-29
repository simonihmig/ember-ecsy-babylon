import Controller from '@ember/controller';
import components from 'ember-babylon/ecsy-babylon/components';
import systems from 'ember-babylon/ecsy-babylon/systems';
import { action } from '@ember/object';

export default class Application extends Controller {
  init() {
    // eslint-disable-next-line prefer-rest-params
    super.init(...arguments);

    this.components = components;
    this.systems = systems;
  }

  rotateValue = 45;

  @action
  rotate() {
    this.set('rotateValue', this.rotateValue + 1);
  }

  @action
  toggleEntity() {
    this.set('showEntity', !this.showEntity);
  }
}
