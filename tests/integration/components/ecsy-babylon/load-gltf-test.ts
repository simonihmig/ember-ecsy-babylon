import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import setupServerMock from 'dummy/tests/helpers/server-mock';
import setupDataDumper from 'dummy/tests/helpers/dump';

module('Integration | Component | ecsy-babylon/load-gltf', function(hooks) {
  setupRenderingTest(hooks);
  setupServerMock(hooks);
  const getData = setupDataDumper(hooks);

  test('it yields loaded asset', async function(assert) {

    await render(hbs`
      <EcsyBabylon as |Scene|>
        <Scene as |World|>
          <World.LoadGltf @file="/gltf/object1" as |ac|>
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
