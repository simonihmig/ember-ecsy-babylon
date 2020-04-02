import { helper } from '@ember/component/helper';
import { Color3, Color4 } from '@babylonjs/core/Maths/math.color';

export function color(params: number[]): Color3 | Color4 {
  switch (params.length) {
    case 3: {
      return new Color3(params[0], params[1], params[2]);
    }
    case 4: {
      return new Color4(params[0], params[1], params[2], params[3]);
    }
    default: {
      throw new Error('Unknown amount of arguments provided');
    }
  }
}

export default helper(color);
