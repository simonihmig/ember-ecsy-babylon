import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, settled } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import setupEcsyBabylon from 'dummy/tests/helpers/setup-ecsy-babylon';
import setupDataDumper from 'dummy/tests/helpers/dump';
import { Scene } from '@babylonjs/core/scene';

module('Integration | Component | ecsy-babylon', function(hooks) {
  setupRenderingTest(hooks);
  setupEcsyBabylon(hooks);
  const getData = setupDataDumper(hooks);

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
    assert.dom('canvas').hasAttribute('tabindex', '0');
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

  test('it resizes engine when canvas is resized', async function(assert) {
    this.set('width', 300);
    this.set('height', 200);

    await render(hbs`
      <div style="width: {{this.width}}px; height: {{this.height}}px">
        <EcsyBabylon @components={{this.components}} @systems={{this.systems}} as |Scene|>
          <Scene as |World|>
            {{dump World}}
          </Scene>
        </EcsyBabylon>
      </div>
    `);

    const engine = (getData() as { scene: Scene}).scene.getEngine();

    assert.equal(engine.getRenderWidth(), 300);
    assert.equal(engine.getRenderHeight(), 200);
    assert.dom('canvas').hasAttribute('width', '300');
    assert.dom('canvas').hasAttribute('height', '200');

    this.set('width', 400);
    this.set('height', 300);

    await settled();

    assert.equal(engine.getRenderWidth(), 400);
    assert.equal(engine.getRenderHeight(), 300);
    assert.dom('canvas').hasAttribute('width', '400');
    assert.dom('canvas').hasAttribute('height', '300');
  });
});
