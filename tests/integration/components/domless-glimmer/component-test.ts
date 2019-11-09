import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, settled } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import DomlessGlimmerComponent, { DomlessGlimmerArgs } from '@kaliber5/ember-ecsy-babylon/components/domless-glimmer';
import { TestContext } from 'ember-test-helpers';

module('Integration | Component | domless-glimmer', function() {

  module('didUpdate', function(hooks) {
    setupRenderingTest(hooks);

    let receivedCreateArgs: any;
    let receivedUpdateArgs: any;
    let instance: DummyComponent;

    class DummyComponent extends DomlessGlimmerComponent {
      constructor(owner: any, args: any) {
        super(owner, args);
        // Using Object.assign to "bake" the Proxy which args is, which does not work well with assertions
        receivedCreateArgs = Object.assign({}, args);
        instance = this;
      }

      didUpdate(args: any) {
        super.didUpdate(args);
        receivedUpdateArgs = Object.assign({}, args);
      }
    }

    hooks.beforeEach(function(this: TestContext) {
      this.owner.register('component:domless-glimmer', DummyComponent);
      this.owner.register('template:components/domless-glimmer', hbs`{{yield this}}`);
      receivedCreateArgs = undefined;
      receivedUpdateArgs = undefined;
    });

    test('it renders', async function(assert) {
      await render(hbs`<DomlessGlimmer>Foo</DomlessGlimmer>`);

      assert.dom(this.element).hasText('Foo');
    });

    test('it receives arguments', async function(assert) {
      this.set('foo', 'bar');
      await render(hbs`<DomlessGlimmer @foo={{this.foo}} />`);

      assert.deepEqual(receivedCreateArgs, { foo: 'bar' });
    });

    test('it receives updated arguments', async function(assert) {
      this.set('foo', 'xxx');
      await render(hbs`<DomlessGlimmer @foo={{this.foo}} />`);

      this.set('foo', 'bar');
      await settled();

      assert.deepEqual(receivedUpdateArgs, { foo: 'bar' });
    });

    test('it receives updates only for real changes', async function(assert) {
      this.set('foo', 'xxx');
      await render(hbs`<DomlessGlimmer @foo={{this.foo}} />`);

      this.set('foo', 'xxx');
      await settled();

      assert.equal(receivedUpdateArgs, undefined);
    });

    test('it receives diff of updated arguments', async function(assert) {
      this.set('x', 0);
      this.set('y', 0);
      await render(hbs`<DomlessGlimmer @x={{this.x}} @y={{this.y}} />`);

      this.set('y', 1);
      await settled();

      assert.deepEqual(receivedUpdateArgs, { y: 1 });

      this.set('x', 1);
      await settled();

      assert.deepEqual(receivedUpdateArgs, { x: 1 });
    });

    test('it has correct args', async function(assert) {
      this.set('foo', 'xxx');
      await render(hbs`<DomlessGlimmer @foo={{this.foo}} />`);

      assert.deepEqual({...instance.args}, { foo: 'xxx' });
      this.set('foo', 'bar');
      await settled();

      assert.deepEqual({...instance.args}, { foo: 'bar' });
    });
  });

  module('willDestroy', function(hooks) {
    setupRenderingTest(hooks);

    interface DummyArgs extends DomlessGlimmerArgs {
      onDestroy?: Function;
    }
    class DummyComponent extends DomlessGlimmerComponent<DummyArgs> {
      willDestroy() {
        super.willDestroy();
        if (this.args.onDestroy) {
          this.args.onDestroy();
        }
      }
    }

    hooks.beforeEach(function(this: TestContext) {
      this.owner.register('component:domless-glimmer', DummyComponent);
      this.owner.register('template:components/domless-glimmer', hbs`{{yield this}}`);
    });

    test('it calls willDestroy', async function(assert) {
      this.set('step', (name: string) => assert.step(name));
      this.set('show', true);
      await render(hbs`
        {{#if this.show}}
          <DomlessGlimmer @onDestroy={{fn this.step "foo"}} />
        {{/if}}`);
      this.set('show', false);

      assert.verifySteps(['foo']);
    });

    test('it calls willDestroy on children first', async function(assert) {
      this.set('step', (name: string) => assert.step(name));
      this.set('show', true);
      await render(hbs`
        {{#if this.show}}
          <DomlessGlimmer @onDestroy={{fn this.step "parent"}} as |parent|>
            <DomlessGlimmer @parent={{parent}} @onDestroy={{fn this.step "child"}} />
          </DomlessGlimmer>
        {{/if}}`);
      this.set('show', false);

      assert.verifySteps(['child', 'parent']);
    });

    test('it calls willDestroy on children in reverse order', async function(assert) {
      this.set('step', (name: string) => assert.step(name));
      this.set('show', true);
      await render(hbs`
        {{#if this.show}}
          <DomlessGlimmer @onDestroy={{fn this.step "parent"}} as |parent|>
            <DomlessGlimmer @parent={{parent}} @onDestroy={{fn this.step "child1"}} />
            <DomlessGlimmer @parent={{parent}} @onDestroy={{fn this.step "child2"}} />
            <DomlessGlimmer @parent={{parent}} @onDestroy={{fn this.step "child3"}} />
          </DomlessGlimmer>
        {{/if}}`);
      this.set('show', false);

      assert.verifySteps(['child3', 'child2', 'child1', 'parent']);
    });
  });
});
