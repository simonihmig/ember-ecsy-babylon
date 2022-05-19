import { module, test } from 'qunit';
import { settled } from '@ember/test-helpers';
import { loadAssetContainer } from 'ember-ecsy-babylon/resources/asset-container';
import { tracked } from '@glimmer/tracking';
import { Scene } from '@babylonjs/core/scene';
import { NullEngine } from '@babylonjs/core/Engines/nullEngine';
import '@babylonjs/loaders/glTF/2.0/glTFLoader';
import { destroy } from '@ember/destroyable';

module('Unit | Resource | AssetContainer', function () {
  class Test {
    scene = new Scene(new NullEngine());

    @tracked url?: string;

    ac = loadAssetContainer(this, () => ({ url: this.url, scene: this.scene }));
  }

  test('it yields loaded asset hash', async function (assert) {
    const test = new Test();
    test.url = '/gltf/object1.gltf';

    assert.strictEqual(
      test.ac.assets,
      undefined,
      'asset container does not exist'
    );
    await settled();

    const container = test.ac.assets!;
    assert.ok(container, 'asset container exists');

    assert.strictEqual(container.meshes.length, 2);
    assert.strictEqual(container.materials.length, 1);
  });

  test('it supports GLB', async function (assert) {
    const test = new Test();
    test.url = '/gltf/object1.glb';

    assert.strictEqual(
      test.ac.assets,
      undefined,
      'asset container does not exist'
    );
    await settled();

    const container = test.ac.assets!;
    assert.ok(container, 'asset container exists');

    assert.strictEqual(container.meshes.length, 2);
    assert.strictEqual(container.materials.length, 1);
  });

  test('it exposes derived loading state', async function (assert) {
    const test = new Test();
    test.url = '/gltf/object1.gltf';

    assert.strictEqual(
      test.ac.assets,
      undefined,
      'asset container does not exist'
    );
    await settled();

    const container = test.ac.assets!;
    assert.ok(container, 'asset container exists');

    assert.strictEqual(container.meshes.length, 2);
    assert.strictEqual(container.materials.length, 1);
  });

  test('it can update', async function (assert) {
    const test = new Test();
    test.url = '/gltf/object1.gltf';

    assert.strictEqual(
      test.ac.assets,
      undefined,
      'asset container does not exist'
    );
    await settled();

    const container1 = test.ac.assets!;
    assert.ok(container1, 'asset container exists');
    const mesh1 = container1.meshes[1];

    test.url = '/gltf/object2.gltf';

    assert.strictEqual(
      test.ac.assets,
      undefined,
      'asset container does not exist'
    );
    await settled();

    const container2 = test.ac.assets!;
    assert.ok(container2, 'asset container exists');

    assert.strictEqual(container2.meshes.length, 2);
    assert.strictEqual(container2.materials.length, 1);
    assert.notOk(container2.meshes[1].isDisposed(), 'new mesh is not disposed');

    assert.ok(mesh1.isDisposed(), 'previous mesh is disposed');
  });

  test('it disposes after teardown', async function (assert) {
    const test = new Test();
    test.url = '/gltf/object1.gltf';

    assert.strictEqual(
      test.ac.assets,
      undefined,
      'asset container does not exist'
    );
    await settled();

    const container = test.ac.assets!;
    assert.ok(container, 'asset container exists');
    const mesh = container.meshes[1];

    destroy(test);
    await settled();

    assert.strictEqual(container.meshes.length, 0);
    assert.strictEqual(container.materials.length, 0);
    assert.ok(mesh.isDisposed(), 'mesh is disposed');
  });

  test('it ignores non-loading assets', async function (assert) {
    const test = new Test();
    test.url = '/gltf/xxx.gltf';

    assert.strictEqual(
      test.ac.assets,
      undefined,
      'asset container does not exist'
    );
    await settled();

    assert.strictEqual(test.ac.assets, null, 'asset container is null');
  });
});
