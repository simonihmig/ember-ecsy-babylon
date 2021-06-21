import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import setupServerMock from 'dummy/tests/helpers/server-mock';
import setupDataDumper from 'dummy/tests/helpers/dump';
import setupEcsyBabylon from 'dummy/tests/helpers/setup-ecsy-babylon';
import { AssetContainer } from '@babylonjs/core/assetContainer';

module('Integration | Component | ecsy-babylon/load-gltf', function(hooks) {
  setupRenderingTest(hooks);
  setupServerMock(hooks);
  setupEcsyBabylon(hooks);
  const getData = setupDataDumper(hooks);

  test('it yields loaded asset', async function(assert) {

    await render(hbs`
      <EcsyBabylon @components={{this.components}} @systems={{this.systems}} as |Scene|>
        <Scene as |World|>
          <World.LoadGltf @file="/gltf/object1" as |ac|>
            {{dump ac}}
          </World.LoadGltf>
        </Scene>
      </EcsyBabylon>
    `);

    const data = getData() as AssetContainer;
    assert.equal(data.meshes.length, 1);
    assert.equal(data.materials.length, 1);
  });
});
