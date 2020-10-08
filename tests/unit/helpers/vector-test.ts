import { module, test } from 'qunit';
import { vector } from 'ember-ecsy-babylon/helpers/vector';
import { Vector2, Vector3, Vector4 } from '@babylonjs/core/Maths/math.vector';

module('Unit | Helper | vector', function() {

  test('it creates a Vector2 instance', async function(assert) {
    const result = vector([1,2]);
    assert.ok(result instanceof Vector2)
    assert.ok((result as Vector2).equals(new Vector2(1,2)));
  });

  test('it creates a Vector3 instance', async function(assert) {
    const result = vector([1,2,3]);
    assert.ok(result instanceof Vector3)
    assert.ok((result as Vector3).equals(new Vector3(1,2,3)));
  });

  test('it creates a Vector4 instance', async function(assert) {
    const result = vector([1,2,3,4]);
    assert.ok(result instanceof Vector4)
    assert.ok((result as Vector4).equals(new Vector4(1,2,3,4)));
  });

  test('it can convert from degrees to radians', async function(assert) {
    const result = vector([0,90,180], {deg: true});
    assert.ok(result instanceof Vector3)
    assert.ok((result as Vector3).equalsWithEpsilon(new Vector3(0, Math.PI/2, Math.PI)));
  });

});
