import { System } from 'ecsy';
import BabylonCore, { BabylonCoreComponent } from './components/babylon-core';
import { assert } from '@ember/debug';

export default class SystemWithCore extends System {
  core?: BabylonCoreComponent;

  execute() {
    if (this.queries.core.added.length) {
      assert('More than 1 core has been added.', this.queries.core.added.length === 1);

      this.core = this.queries.core.added[0].getComponent(BabylonCore);
    }

    if (this.queries.core.removed.length) {
      this.core = undefined;
    }

    if(!this.core) {
      throw new Error('No BabylonCore Component found. Have you instantiated the right Root Ecsy component?');
    }
  }
}

export const queries =  {
  core: {
    components: [BabylonCore],
    listen: {
      added: true,
      removed: true
    }
  }
};

SystemWithCore.queries = queries;
