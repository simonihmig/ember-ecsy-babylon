import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import * as components from 'ecsy-babylon/components';
// eslint-disable-next-line no-restricted-imports
import { systems } from 'ecsy-babylon';
import { mapComponentImports } from 'ember-ecsy-babylon';

export default class PlaygroundController extends Controller {
  components = mapComponentImports(components);
  systems = systems;

  @tracked
  rotateValue = 45;

  @tracked
  showEntity = true;

  @tracked
  arcRotateCamera = true;

  @tracked
  showViewer = true;

  @action
  rotate(direction: 'right' | 'left', degrees: number): void {
    this.rotateValue =
      direction === 'left'
        ? this.rotateValue - degrees
        : this.rotateValue + degrees;
  }

  @action
  toggleCamera(): void {
    this.arcRotateCamera = !this.arcRotateCamera;
  }

  @action
  toggleEntity(): void {
    this.showEntity = !this.showEntity;
  }

  @action
  toggleViewer(): void {
    this.showViewer = !this.showViewer;
  }
}
