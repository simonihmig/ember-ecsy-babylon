import Controller from '@ember/controller';
import { action } from '@ember/object';
import { VideoTexture } from '@babylonjs/core/Materials/Textures/videoTexture';
import { tracked } from '@glimmer/tracking';

export default class Application extends Controller {

  @tracked
  rotateValue = 45;

  @tracked
  showEntity = true;

  @tracked
  arcRotateCamera = true;

  @tracked
  showViewer = true;

  VideoTexture = VideoTexture;

  @action
  rotate(direction: 'right' | 'left', degrees: number): void {
    this.rotateValue = direction === 'left' ? this.rotateValue - degrees : this.rotateValue + degrees;
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
