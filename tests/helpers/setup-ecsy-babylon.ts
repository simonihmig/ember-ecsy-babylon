import * as components from 'ecsy-babylon/components';
// eslint-disable-next-line no-restricted-imports
import { systems } from 'ecsy-babylon';
import { mapComponentImports } from 'ember-ecsy-babylon';
import { TestContext } from 'ember-test-helpers';

export default function setupEcsyBabylon(hooks: NestedHooks): void {
  hooks.beforeEach(function (this: TestContext) {
    this.set('components', mapComponentImports(components));
    this.set('systems', systems);
  });
}
