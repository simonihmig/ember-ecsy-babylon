import { helper } from '@ember/component/helper';
import { AbstractMesh } from '@babylonjs/core/Meshes/abstractMesh';

export function getBoundingInfo([mesh]: [AbstractMesh]/*, hash*/) {
  return mesh.getBoundingInfo();
}

export default helper(getBoundingInfo);
