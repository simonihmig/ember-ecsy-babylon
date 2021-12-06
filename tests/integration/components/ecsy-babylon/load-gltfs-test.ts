/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, settled, waitUntil } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import setupDataDumper from 'dummy/tests/helpers/dump';
import setupEcsyBabylon from 'dummy/tests/helpers/setup-ecsy-babylon';
import { AssetContainerHash } from 'ember-ecsy-babylon/components/ecsy-babylon/load-gltfs';
import { timeout } from 'ember-concurrency';

module('Integration | Component | ecsy-babylon/load-gltfs', function (hooks) {
  setupRenderingTest(hooks);
  setupEcsyBabylon(hooks);
  const getData = setupDataDumper<AssetContainerHash>(hooks);

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

    await waitUntil(() => {
      const data = getData();
      return data && Object.keys(data).length;
    });
    const data = getData()!;
    assert.deepEqual(Object.keys(data).sort(), ['obj1', 'obj2']);
    assert.equal(data.obj1?.meshes.length, 2);
    assert.equal(data.obj1?.materials.length, 1);
    assert.equal(data.obj2?.meshes.length, 2);
    assert.equal(data.obj2?.materials.length, 1);
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

    await waitUntil(() => {
      const data = getData();
      return data && Object.keys(data).length;
    });
    const data = getData()!;
    assert.deepEqual(Object.keys(data).sort(), ['obj1', 'obj2']);
    assert.equal(data.obj1?.meshes.length, 2);
    assert.equal(data.obj1?.materials.length, 1);
    assert.equal(data.obj2?.meshes.length, 2);
    assert.equal(data.obj2?.materials.length, 1);
  });

  test('it can update', async function (assert) {
    this.set('files', {
      obj1: '/gltf/object1.gltf',
      obj2: '/gltf/object2.gltf',
    });

    await render(hbs`
      <EcsyBabylon @components={{this.components}} @systems={{this.systems}} as |Scene|>
        <Scene as |World|>
          <World.LoadGltfs @files={{this.files}} as |ach|>
            {{dump ach}}
          </World.LoadGltfs>
        </Scene>
      </EcsyBabylon>
    `);

    await waitUntil(() => {
      const data = getData();
      return data && Object.keys(data).length;
    });
    const data1 = getData()!;
    const data1obj1Mesh = data1.obj1?.meshes[1];
    const data1obj2Mesh = data1.obj2?.meshes[1];

    this.set('files', {
      obj1: '/gltf/object1.gltf',
      obj3: '/gltf/object3.gltf',
    });
    await settled();
    await waitUntil(() => {
      const data = getData();
      return data && 'obj3' in data;
    });
    await timeout(50);

    const data2 = getData()!;
    assert.deepEqual(Object.keys(data1).sort(), ['obj1', 'obj2']);
    assert.deepEqual(Object.keys(data2).sort(), ['obj1', 'obj3']);

    assert.strictEqual(
      data1.obj1,
      data2.obj1,
      'Unchanged assets have the same container'
    );

    assert.equal(data2.obj1?.meshes.length, 2);
    assert.notOk(data2.obj1?.meshes[1].isDisposed());
    assert.equal(data2.obj1?.materials.length, 1);
    assert.equal(data2.obj3?.meshes.length, 2);
    assert.notOk(data2.obj3?.meshes[1].isDisposed());
    assert.equal(data2.obj3?.materials.length, 1);

    assert.equal(data1.obj2?.meshes.length, 0);
    assert.ok(data1obj2Mesh?.isDisposed());

    this.set('files', {
      obj1: '/gltf/object2.gltf',
      dummy: '/gltf/object3.gltf',
    });
    await settled();
    await waitUntil(() => {
      const data = getData();
      return data && 'dummy' in data;
    });
    await timeout(50);

    const data3 = getData()!;
    assert.deepEqual(Object.keys(data3).sort(), ['dummy', 'obj1']);

    assert.notStrictEqual(
      data1.obj1,
      data3.obj1,
      'Changed assets have different container'
    );

    assert.equal(data3.obj1?.meshes.length, 2);
    assert.notOk(data3.obj1?.meshes[1].isDisposed());
    assert.equal(data3.obj1?.materials.length, 1);

    assert.equal(data1.obj1?.meshes.length, 0);
    assert.ok(data1obj1Mesh?.isDisposed());
  });

  test('it disposes after teardown', async function (assert) {
    this.set('show', true);
    await render(hbs`
      <EcsyBabylon @components={{this.components}} @systems={{this.systems}} as |Scene|>
        <Scene as |World|>
          {{#if this.show}}
            <World.LoadGltfs @files={{hash obj1="/gltf/object1.gltf" obj2="/gltf/object2.gltf"}} as |ach|>
              {{dump ach}}
            </World.LoadGltfs>
          {{/if}}
        </Scene>
      </EcsyBabylon>
    `);

    await waitUntil(() => {
      const data = getData();
      return data && Object.keys(data).length;
    });
    const data = getData()!;
    const mesh = data.obj1?.meshes[1];

    this.set('show', false);
    await settled();
    await timeout(50);

    assert.equal(data.obj1?.meshes.length, 0);
    assert.equal(data.obj1?.materials.length, 0);
    assert.equal(data.obj2?.meshes.length, 0);
    assert.equal(data.obj2?.materials.length, 0);
    assert.ok(mesh?.isDisposed());
  });

  test('it ignores non-loading assets', async function (assert) {
    await render(hbs`
      <EcsyBabylon @components={{this.components}} @systems={{this.systems}} as |Scene|>
        <Scene as |World|>
          <World.LoadGltfs @files={{hash obj1="/gltf/object1.gltf" obj2="/gltf/xxx.gltf"}} as |ach|>
            {{dump ach}}
          </World.LoadGltfs>
        </Scene>
      </EcsyBabylon>
    `);

    await waitUntil(() => {
      const data = getData();
      return data && Object.keys(data).length;
    });
    const data = getData()!;
    assert.deepEqual(Object.keys(data).sort(), ['obj1', 'obj2']);
    assert.equal(data.obj1?.meshes.length, 2);
    assert.equal(data.obj1?.materials.length, 1);
    assert.equal(data.obj2, null);
  });
});
