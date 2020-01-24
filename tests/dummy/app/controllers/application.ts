import Controller from '@ember/controller';
import { components, systems } from 'ecsy-babylon';
import { action } from '@ember/object';

export default class Application extends Controller {
  components = components;
  systems = systems;

  rotateValue = 45;
  showEntity = true;
  arcRotateCamera = true;

  showViewer = true;

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

  @action
  toggleViewer() {
    this.set('showViewer', !this.showViewer)
  }
}
