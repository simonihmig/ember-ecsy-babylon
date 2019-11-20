import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { mergeW } from '@kaliber5/ember-ecsy-babylon/helpers/merge-w';
import { World } from 'ecsy';

module('Integration | Helper | merge-w', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    await render(hbs`{{merge-w (hash foo="bar") (hash foo="baz")}}`);

    assert.dom(this.element).hasText('[object Object]');
  });

  test('it merges the parameters together', async function(assert) {
    const world = new World();

    const oldVal = {
      world,
      foo: 'bar',
      private: {
        bar: 'foo',
        foo: 'bax'
      }
    };

    const newVal = {
      foo: 'baz',
      private: {
        baz: 'bay',
        foo: 'ban'
      }
    };

    const expected = {
      world,
      foo: 'baz',
      private: {
        bar: 'foo',
        baz: 'bay',
        foo: 'ban'
      }
    };

    // @ts-ignore
    const result = mergeW([oldVal, newVal]);

    // @ts-ignore
    assert.deepEqual(result, expected);
  });
});
