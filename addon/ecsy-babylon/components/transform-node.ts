import { Component, createComponentClass } from 'ecsy';
import { TransformNode } from '@babylonjs/core';

export interface TransformNodeComponent extends Component {
  value: TransformNode | null;
}

export default createComponentClass<TransformNodeComponent>({
  value: { default: null }
}, 'TransformNode');
