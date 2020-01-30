import Pretender from 'pretender';
import { TestContext } from "ember-test-helpers";

export default function setupServerMock(hooks: NestedHooks) {
  let server: Pretender;

  hooks.beforeEach(function(this: TestContext) {
    server = new Pretender();
    server.get('/gltf/:filename', () => {
      return [200, { 'content-type': 'model/gltf+json' }, '{}'];
    }, false);
  });
  hooks.afterEach(function() {
    server.shutdown();
  });
}
