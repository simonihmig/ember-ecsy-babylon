import { Component, createComponentClass } from 'ecsy';
import { PBRMaterial } from '@babylonjs/core';

interface PBRMaterialComponent extends Component {
  value: PBRMaterial | null;
  dispose: boolean;
}

export default createComponentClass<PBRMaterialComponent>({
  value: { default: null },
  dispose: { default: false }
}, 'Material');
