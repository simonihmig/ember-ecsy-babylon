import { Component, createComponentClass } from 'ecsy';
import { TransformNode } from '@babylonjs/core';

interface TransformNodeComponent extends Component {
  value: TransformNode | null;
}

export default createComponentClass<TransformNodeComponent>({
  value: { default: null }
}, 'TransformNode');
