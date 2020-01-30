import { TestContext } from "ember-test-helpers";
import { helper } from '@ember/component/helper';

export default function setupDataDumper(hooks: NestedHooks): () => any {
  let data: any;
  const dumpHelper = helper(function dump([argument]: any[]) {
    data = argument;
  });

  hooks.beforeEach(function(this: TestContext) {
    this.owner.register('helper:dump', dumpHelper);
  });
  hooks.afterEach(function() {
    data = undefined;
  });

  return () => data;
}
