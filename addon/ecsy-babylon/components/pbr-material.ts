import { Component, createComponentClass } from 'ecsy';
import { PBRMaterial, Color3 } from '@babylonjs/core';
import Types from '../types';

interface PBRMaterialComponent extends Component {
  value: PBRMaterial | null;
  ambientColor: Color3 | null;
  albedoColor: Color3 | null;
  emissiveColor: Color3 | null;
  roughness: number | null;
  metallic: number | null;
}

export default createComponentClass<PBRMaterialComponent>({
  value: { default: null },
  ambientColor: { default: new Color3(0, 0, 0), type: Types.Color3 },
  albedoColor: { default: new Color3(1, 1, 1), type: Types.Color3 },
  emissiveColor: { default: new Color3(0, 0, 0), type: Types.Color3 },
  roughness: { default: null, type: Types.OptionalNumber },
  metallic: { default: null,  type: Types.OptionalNumber },
}, 'PbrMaterial');
