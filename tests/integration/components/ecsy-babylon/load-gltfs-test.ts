import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, waitUntil } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import setupDataDumper from 'dummy/tests/helpers/dump';
import setupEcsyBabylon from 'dummy/tests/helpers/setup-ecsy-babylon';
import { AssetContainerHash } from 'ember-ecsy-babylon/components/ecsy-babylon/load-gltfs';

module('Integration | Component | ecsy-babylon/load-gltfs', function (hooks) {
  setupRenderingTest(hooks);
  setupEcsyBabylon(hooks);
  const getData = setupDataDumper(hooks);

  test('it yields loaded asset hash', async function (assert) {
    await render(hbs`
      <EcsyBabylon @components={{this.components}} @systems={{this.systems}} as |Scene|>
        <Scene as |World|>
          <World.LoadGltfs @files={{hash obj1="/gltf/object1.gltf" obj2="/gltf/object2.gltf"}} as |ach|>
            {{dump ach}}
          </World.LoadGltfs>
        </Scene>
      </EcsyBabylon>
    `);

    await waitUntil(getData);
    const data = getData() as AssetContainerHash;
    assert.deepEqual(Object.keys(data), ['obj1', 'obj2']);
    assert.equal(data.obj1.meshes.length, 1);
    assert.equal(data.obj1.materials.length, 1);
    assert.equal(data.obj2.meshes.length, 1);
    assert.equal(data.obj2.materials.length, 1);
  });

  test('it supports GLB', async function (assert) {
    await render(hbs`
      <EcsyBabylon @components={{this.components}} @systems={{this.systems}} as |Scene|>
        <Scene as |World|>
          <World.LoadGltfs @files={{hash obj1="/gltf/object1.glb" obj2="/gltf/object2.glb"}} as |ach|>
            {{dump ach}}
          </World.LoadGltfs>
        </Scene>
      </EcsyBabylon>
    `);

    await waitUntil(getData);
    const data = getData() as AssetContainerHash;
    assert.deepEqual(Object.keys(data), ['obj1', 'obj2']);
    assert.equal(data.obj1.meshes.length, 1);
    assert.equal(data.obj1.materials.length, 1);
    assert.equal(data.obj2.meshes.length, 1);
    assert.equal(data.obj2.materials.length, 1);
  });
});
