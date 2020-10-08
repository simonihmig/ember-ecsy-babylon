import { helper } from '@ember/component/helper';
import { Vector2, Vector3, Vector4 } from '@babylonjs/core/Maths/math.vector';

export function vector(params: number[], { deg = false }: { deg?: boolean } = {}): Vector2 | Vector3 | Vector4 {
  if (deg) {
    params = params.map((degree) => degree / 180 * Math.PI );
  }
  const [x, y, z, w] = params;

  switch (params.length) {
    case 2: {
      return new Vector2(x, y);
    }
    case 3: {
      return new Vector3(x, y, z);
    }
    case 4: {
      return new Vector4(x, y, z, w);
    }
    default: {
      throw new Error('Unknown amount of arguments provided');
    }
  }
}

export default helper(vector);
