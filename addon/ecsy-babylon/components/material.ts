import { Component, createComponentClass } from 'ecsy';
import { Material } from '@babylonjs/core';

export interface MaterialComponent extends Component {
  value: Material;
}

export default createComponentClass<MaterialComponent>({
  value: { default: null }
}, 'Material');
