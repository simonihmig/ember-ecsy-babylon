import { module, test } from 'qunit';
import { visit, currentURL } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';

module('Acceptance | smoke-test', function (hooks) {
  setupApplicationTest(hooks);

  test('dummy app works', async function (assert) {
    await visit('/');
    assert.equal(currentURL(), '/');

    await visit('/playground');
    assert.equal(currentURL(), '/playground');

    await visit('/xr');
    assert.equal(currentURL(), '/xr');
  });
});
