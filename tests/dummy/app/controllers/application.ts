import Controller from '@ember/controller';
import components from '@kaliber5/ember-ecsy-babylon/ecsy-babylon/components/index';
import systems from '@kaliber5/ember-ecsy-babylon/ecsy-babylon/systems';
import { action } from '@ember/object';

export default class Application extends Controller {
  components = components;
  systems = systems;

  rotateValue = 45;
  showEntity = false;
  arcRotateCamera = true;

  @action
  rotate(direction: 'right' | 'left', degrees: number) {
    this.set('rotateValue', direction === 'left' ? this.rotateValue - degrees : this.rotateValue + degrees);
  }

  @action
  toggleCamera() {
    this.set('arcRotateCamera', !this.arcRotateCamera);
  }

  @action
  toggleEntity() {
    this.set('showEntity', !this.showEntity);
  }
}
