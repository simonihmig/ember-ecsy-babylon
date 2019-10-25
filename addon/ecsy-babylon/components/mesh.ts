import {Component, createComponentClass} from 'ecsy';
import { Mesh } from '@babylonjs/core';

interface MeshComponent extends Component {
  value: Mesh | null;
}

export default createComponentClass<MeshComponent>({
  value: { default: null }
}, 'Mesh');
