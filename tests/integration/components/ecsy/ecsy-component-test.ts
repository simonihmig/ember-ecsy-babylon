import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, settled } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import setupDataDumper from 'dummy/tests/helpers/dump';
import { Component, Types } from 'ecsy';

module('Integration | Component | ecsy/component', function (hooks) {
  setupRenderingTest(hooks);
  const getData = setupDataDumper(hooks);

  test('it add component to entity', async function (assert) {
    class DummyComponent extends Component<DummyComponent> {
      foo?: string;

      static schema = {
        foo: { type: Types.String },
      };
    }

    this.set('components', new Map([['dummy', DummyComponent]]));

    await render(hbs`
      <Ecsy @systems={{array}} @components={{this.components}} as |world|>
        {{dump world.world}}
        <world.Entity {{dummy foo="bar"}}/>
      </Ecsy>
    `);

    const { entityManager } = getData() as any;
    assert.equal(entityManager._entities.length, 1);
    const entity = entityManager._entities[0];
    const component = entity.getComponent(DummyComponent);
    assert.ok(component, 'entity has component');
    assert.equal(component.foo, 'bar', 'component has passed arguments');
  });

  test('it does not leak passed instances', async function (assert) {
    class DummyComponent extends Component<DummyComponent> {
      foo?: {};

      static schema = {
        foo: { type: Types.JSON },
      };
    }

    this.set('components', new Map([['dummy', DummyComponent]]));

    let instance = { bar: true };
    this.set('instance', instance);

    await render(hbs`
      <Ecsy @systems={{array}} @components={{this.components}} as |world|>
        {{dump world.world}}
        <world.Entity {{dummy foo=this.instance}}/>
      </Ecsy>
    `);

    const { entityManager } = getData() as any;
    assert.equal(entityManager._entities.length, 1);
    const entity = entityManager._entities[0];
    let component = entity.getComponent(DummyComponent);
    assert.ok(component, 'entity has component');
    assert.deepEqual(component.foo, instance, 'component has passed argument');
    assert.notStrictEqual(
      component.foo,
      instance,
      'component has different instance'
    );

    instance = { bar: false };
    this.set('instance', instance);
    await settled();

    component = entity.getComponent(DummyComponent);
    assert.ok(component, 'entity has component');
    assert.deepEqual(component.foo, instance, 'component has passed argument');
    assert.notStrictEqual(
      component.foo,
      instance,
      'component has different instance'
    );
  });
});
