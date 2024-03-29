import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import setupDataDumper from 'dummy/tests/helpers/dump';

module('Integration | Component | ecsy/entity', function (hooks) {
  setupRenderingTest(hooks);
  const getData = setupDataDumper(hooks);

  hooks.beforeEach(function () {
    this.set('systems', []);
  });

  test('it adds entity', async function (assert) {
    this.set('show', false);
    this.set('components', new Map());
    await render(hbs`
      <Ecsy @systems={{this.systems}} @components={{this.components}} as |world|>
        {{dump world.world}}
        {{#if this.show}}
          <world.Entity />
        {{/if}}
      </Ecsy>
    `);

    const world = getData() as any;
    assert.strictEqual(world.entityManager._entities.length, 0);
    this.set('show', true);
    assert.strictEqual(world.entityManager._entities.length, 1);
  });
});
