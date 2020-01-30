import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import setupServerMock from 'dummy/tests/helpers/server-mock';
import setupDataDumper from 'dummy/tests/helpers/dump';
import { TestContext } from "ember-test-helpers";
import { components, systems } from 'ecsy-babylon';

module('Integration | Component | ecsy-babylon/load-gltf', function(hooks) {
  setupRenderingTest(hooks);
  setupServerMock(hooks);
  const getData = setupDataDumper(hooks);
  hooks.beforeEach(function(this: TestContext) {
    this.set('components', components);
    this.set('systems', systems);
  });

  test('it yields loaded asset', async function(assert) {

    await render(hbs`
      <EcsyBabylon @components={{this.components}} @systems={{this.systems}} as |Scene|>
        <Scene as |World|>
          <World.LoadGltf @fileUrl="/gltf/object1" as |ac|>
            {{dump ac}}
          </World.LoadGltf>
        </Scene>
      </EcsyBabylon>
    `);

    const data = getData();
    assert.deepEqual(data.meshes, []);
    assert.deepEqual(data.materials, []);
  });
});
