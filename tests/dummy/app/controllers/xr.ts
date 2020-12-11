import Controller from '@ember/controller';
import * as components from 'ecsy-babylon/components';
// eslint-disable-next-line no-restricted-imports
import { systems } from 'ecsy-babylon';
import { mapComponentImports } from 'ember-ecsy-babylon';

export default class XrController extends Controller {

  queryParams = ['mode'];

  mode: 'vr' | 'ar' = 'vr';

  get sessionMode(): string {
    return `immersive-${this.mode}`;
  }

  components = mapComponentImports(components);
  systems = systems;

}
