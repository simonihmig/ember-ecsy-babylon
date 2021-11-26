import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import * as components from 'ecsy-babylon/components';
// eslint-disable-next-line no-restricted-imports
import { systems } from 'ecsy-babylon';
import { mapComponentImports } from 'ember-ecsy-babylon';
// we use an .env texture, so make sure we have the loader in our (tree-shaken) bundle!
import '@babylonjs/core/Materials/Textures/Loaders/envTextureLoader';
import { Color3 } from '@babylonjs/core/Maths/math.color';

export default class PlaygroundController extends Controller {
  components = mapComponentImports(components);
  systems = systems;

  @tracked
  rotateValue = 45;

  @tracked
  showView = true;

  @tracked
  showLight = true;

  @tracked
  metallic = 0.5;

  @tracked
  roughness = 0.5;

  colors = [Color3.Red(), Color3.Green(), Color3.Blue()];

  @tracked
  color = this.colors[0];

  @tracked
  dof = false;

  @tracked
  focusDistance = 10000;

  @tracked
  hover: number | null = null;

  @action
  rotate(direction: 'right' | 'left', degrees: number): void {
    this.rotateValue =
      direction === 'left'
        ? this.rotateValue - degrees
        : this.rotateValue + degrees;
  }

  @action
  setCheck(property: keyof this, event: Event): void {
    this[property] = (event.target as HTMLInputElement).checked as any;
  }

  @action
  setInput(property: keyof this, event: Event): void {
    this[property] = parseFloat(
      (event.target as HTMLInputElement).value
    ) as any;
  }

  @action
  setValue(property: keyof this, value: any): void {
    this[property] = value;
  }
}
