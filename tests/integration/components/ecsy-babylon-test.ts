import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import setupServerMock from 'dummy/tests/helpers/server-mock';
import setupEcsyBabylon from 'dummy/tests/helpers/setup-ecsy-babylon';

module('Integration | Component | ecsy-babylon', function(hooks) {
  setupRenderingTest(hooks);
  setupServerMock(hooks);
  setupEcsyBabylon(hooks);

  test('it renders canvas', async function(assert) {
    await render(hbs`
      <EcsyBabylon @components={{this.components}} @systems={{this.systems}} as |Scene|>
        <Scene as |World|>
          <World.Entity
            {{arc-rotate-camera lowerRadiusLimit=5 upperRadiusLimit=20 radius=10}}
          />
          <World.Entity
            {{box size=2 width=3}}
            {{pbr-material ambientColor=(color 0 1 0) albedoColor=(color 0 1 0) metallic=0.5 roughness=0.5}}
          />
        </Scene>
      </EcsyBabylon>
    `);

    assert.dom('canvas').exists();
  });

  test('it supports named blocks for block HTML content', async function(assert) {
    await render(hbs`
      <EcsyBabylon @components={{this.components}} @systems={{this.systems}}>
        <:ecsy as |Scene|>
          <Scene as |World|>
            <World.Entity
              {{arc-rotate-camera lowerRadiusLimit=5 upperRadiusLimit=20 radius=10}}
            />
            <World.Entity
              {{box size=2 width=3}}
              {{pbr-material ambientColor=(color 0 1 0) albedoColor=(color 0 1 0) metallic=0.5 roughness=0.5}}
            />
          </Scene>
        </:ecsy>
        <:html>
          <div id="fallback">Fallback HTML content</div>
        </:html>
      </EcsyBabylon>
    `);

    assert.dom('canvas').exists();
    assert.dom('canvas #fallback').exists();
    assert.dom('canvas #fallback').hasText('Fallback HTML content');
  });
});
