import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import Pretender from 'pretender';
import { components, systems } from 'ecsy-babylon';
import { helper } from '@ember/component/helper';
import { TestContext } from "ember-test-helpers";

module('Integration | Component | ecsy-babylon/load-gltfs', function(hooks) {
  let data: any;
  const dumpHelper = helper(function dump([argument]: any[]) {
    data = argument;
  });

  let server: Pretender;
  setupRenderingTest(hooks);
  hooks.beforeEach(function(this: TestContext) {
    server = new Pretender();
    server.get('/gltf/:filename', () => {
      return [200, { 'content-type': 'model/gltf+json' }, '{}'];
    }, false);
    this.set('components', components);
    this.set('systems', systems);
    this.owner.register('helper:dump', dumpHelper);
  });
  hooks.afterEach(function() {
    server.shutdown();
  });

  test('it yields loaded asset hash', async function(assert) {

    await render(hbs`
      <EcsyBabylon @components={{this.components}} @systems={{this.systems}} as |Scene|>
        <Scene as |World|>
          <World.LoadGltfs @obj1="/gltf/object1" @obj2="/gltf/object2" as |ach|>
            {{dump ach}}
          </World.LoadGltfs>
        </Scene>
      </EcsyBabylon>
    `);

    assert.deepEqual(Object.keys(data), ['obj1', 'obj2']);
    assert.deepEqual(data.obj1.meshes, []);
    assert.deepEqual(data.obj1.materials, []);
    assert.deepEqual(data.obj2.meshes, []);
    assert.deepEqual(data.obj2.materials, []);
  });
});
