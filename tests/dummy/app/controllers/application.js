import Controller from '@ember/controller';
import { Object3D } from 'ember-babylon/ecsy/components/object-3d';

export default class Application extends Controller {
  init() {
    super.init(...arguments);

    this.components = [Object3D];
    this.systems = [];
  }
}
