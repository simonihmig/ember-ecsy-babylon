import { helper } from '@ember/component/helper';
import { AbstractMesh } from '@babylonjs/core/Meshes/abstractMesh';
import { BoundingInfo } from '@babylonjs/core/Culling/boundingInfo';

export function getBoundingInfo([mesh]: [AbstractMesh]/*, hash*/): BoundingInfo {
  return mesh.getBoundingInfo();
}

export default helper(getBoundingInfo);
