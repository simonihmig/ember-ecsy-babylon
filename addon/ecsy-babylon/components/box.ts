import { Component, createComponentClass } from 'ecsy';
import { Mesh } from "@babylonjs/core";

interface BoxComponent extends Component {
  size: number;
  width?: number;
  height?: number;
  depth?: number;
  // TODO
  // faceColors: Color4[];
  // faceUV: Vector4[];
  updatable: boolean;
  sideOrientation: number;
}

export default createComponentClass<BoxComponent>({
  size: { default: 1 },
  width: { default: undefined },
  height: { default: undefined },
  depth: { default: undefined},
  updatable: { default: false },
  sideOrientation: { default: Mesh.DEFAULTSIDE }
}, 'Box');
