import { Mesh as _Mesh } from '@babylonjs/core';

export default class Mesh {
  value?: _Mesh | null;

  reset() {
    this.value = null;
  }
}
