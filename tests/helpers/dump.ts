import { TestContext } from 'ember-test-helpers';
import { helper } from '@ember/component/helper';

export default function setupDataDumper<T = unknown>(
  hooks: NestedHooks
): () => T | undefined {
  let data: T | undefined;
  const dumpHelper = helper(function dump([argument]: T[]) {
    data = argument;
  });

  hooks.beforeEach(function (this: TestContext) {
    this.owner.register('helper:dump', dumpHelper);
  });
  hooks.afterEach(function () {
    data = undefined;
  });

  return () => data;
}
