import { Component, createComponentClass } from 'ecsy';
import { Mesh } from '@babylonjs/core';

export interface MeshComponent extends Component {
  value: Mesh | null;
  dispose: boolean;
}

export default createComponentClass<MeshComponent>({
  value: { default: null },
  dispose: { default: false }
}, 'Mesh');
