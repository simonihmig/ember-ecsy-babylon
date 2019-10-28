import { helper } from '@ember/component/helper';
import { Vector2, Vector3, Vector4 } from '@babylonjs/core';

export function vector(params: number[]): Vector2 | Vector3 | Vector4 {
  switch (params.length) {
    case 2: {
      return new Vector2(params[0], params[1]);
    }
    case 3: {
      return new Vector3(params[0], params[1], params[2]);
    }
    case 4: {
      return new Vector4(params[0], params[1], params[2], params[3]);
    }
    default: {
      throw new Error('Unknown amount of arguments provided');
    }
  }
}

export default helper(vector);
