import { module, test } from 'qunit';
import { visit, currentURL } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import { timeout } from 'ember-concurrency';

module('Acceptance | smoke-test', function (hooks) {
  setupApplicationTest(hooks);

  test('index works', async function (assert) {
    await visit('/');
    assert.equal(currentURL(), '/');
  });

  test('playground works', async function (assert) {
    await visit('/playground');
    assert.equal(currentURL(), '/playground');

    // BJS can cause some errors here when the scene is disposed before an environment image has loaded
    // That's a bug we cannot fix here
    await timeout(100);
  });

  test('xr works', async function (assert) {
    await visit('/xr');
    assert.equal(currentURL(), '/xr');
  });
});
