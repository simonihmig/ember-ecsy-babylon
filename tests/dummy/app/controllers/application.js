import Controller from '@ember/controller';
import components from 'ember-babylon/ecsy/components';
import systems from 'ember-babylon/ecsy/systems';

export default class Application extends Controller {
  init() {
    // eslint-disable-next-line prefer-rest-params
    super.init(...arguments);

    this.components = components;
    this.systems = systems;
  }
}
