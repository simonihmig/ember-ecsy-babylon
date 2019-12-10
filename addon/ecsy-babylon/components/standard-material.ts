import { Component, createComponentClass } from 'ecsy';
import { Color3 } from '@babylonjs/core';
import Types from '../types';

export interface PBRMaterialComponent extends Component {
  ambientColor: Color3 | null;
  diffuseColor: Color3 | null;
  emissiveColor: Color3 | null;
  disableLighting: boolean;
  alpha: number;
}

export default createComponentClass<PBRMaterialComponent>({
  ambientColor: { default: new Color3(0, 0, 0), type: Types.Color3 },
  diffuseColor: { default: new Color3(1, 1, 1), type: Types.Color3 },
  emissiveColor: { default: new Color3(0, 0, 0), type: Types.Color3 },
  disableLighting: { default: false },
  alpha: { default: 1.0 }
}, 'StandardMaterial');
