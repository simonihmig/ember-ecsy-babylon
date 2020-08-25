import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import setupDataDumper from 'dummy/tests/helpers/dump';
import { Component, Types } from 'ecsy';

module('Integration | Component | ecsy/component', function(hooks) {
  setupRenderingTest(hooks);
  const getData = setupDataDumper(hooks);

  test('it add component to entity', async function(assert) {

    class DummyComponent extends Component<DummyComponent> {
      foo?: string;

      static schema = {
        foo: { type: Types.String }
      }
    }

    this.set('components', new Map([['dummy', DummyComponent]]));

    await render(hbs`
      <Ecsy @systems={{array}} @components={{this.components}} as |world|>
        {{dump world.world}}
        <world.Entity {{dummy foo="bar"}}/>
      </Ecsy>
    `);

    const { entityManager } = getData();
    assert.equal(entityManager._entities.length, 1);
    const entity = entityManager._entities[0];
    const component = entity.getComponent(DummyComponent);
    assert.ok(component, 'entity has component');
    assert.equal(component.foo, 'bar', 'component has passed arguments');
  });
});
