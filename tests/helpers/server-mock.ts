import Pretender from 'pretender';
import { TestContext } from "ember-test-helpers";
import { components, systems } from 'ecsy-babylon';

export default function setupServerMock(hooks: NestedHooks) {
  let server: Pretender;

  hooks.beforeEach(function(this: TestContext) {
    server = new Pretender();
    server.get('/gltf/:filename', () => {
      return [200, { 'content-type': 'model/gltf+json' }, '{}'];
    }, false);
    this.set('components', components);
    this.set('systems', systems);
  });
  hooks.afterEach(function() {
    server.shutdown();
  });
}
