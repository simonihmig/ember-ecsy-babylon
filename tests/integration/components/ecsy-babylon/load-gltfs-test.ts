import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import setupServerMock from 'dummy/tests/helpers/server-mock';
import setupDataDumper from 'dummy/tests/helpers/dump';

module('Integration | Component | ecsy-babylon/load-gltfs', function(hooks) {
  setupRenderingTest(hooks);
  setupServerMock(hooks);
  const getData = setupDataDumper(hooks);

  test('it yields loaded asset hash', async function(assert) {

    await render(hbs`
      <EcsyBabylon as |Scene|>
        <Scene as |World|>
          <World.LoadGltfs @files={{hash obj1="/gltf/object1" obj2="/gltf/object2"}} as |ach|>
            {{dump ach}}
          </World.LoadGltfs>
        </Scene>
      </EcsyBabylon>
    `);

    const data = getData();
    assert.deepEqual(Object.keys(data), ['obj1', 'obj2']);
    assert.equal(data.obj1.meshes.length, 1);
    assert.equal(data.obj1.materials.length, 1);
    assert.equal(data.obj2.meshes.length, 1);
    assert.equal(data.obj2.materials.length, 1);
  });
});
