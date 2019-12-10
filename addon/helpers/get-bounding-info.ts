import { helper } from '@ember/component/helper';
import { AbstractMesh } from '@babylonjs/core';

export function getBoundingInfo([mesh]: [AbstractMesh]/*, hash*/) {
  return mesh.getBoundingInfo();
}

export default helper(getBoundingInfo);
