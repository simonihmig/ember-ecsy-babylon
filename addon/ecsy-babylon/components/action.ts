import { Component, createComponentClass } from 'ecsy';

export interface ActionComponent extends Component {
  pick?: Function,
  doublePick?: Function,
  centerPick?: Function,
  everyFrame?: Function,
  intersectionEnter?: Function,
  intersectionExit?: Function,
  keyDown?: Function,
  keyUp?: Function,
  leftPick?: Function,
  longPress?: Function,
  pickDown?: Function,
  pickOut?: Function,
  pickUp?: Function,
  pointerOut?: Function,
  pointerOver?: Function,
  rightPick?: Function,
}

export default createComponentClass<ActionComponent>({
  pick: { default: null },
  doublePick: { default: null },
  centerPick: { default: null },
  everyFrame: { default: null },
  intersectionEnter: { default: null },
  intersectionExit: { default: null },
  keyDown: { default: null },
  keyUp: { default: null },
  leftPick: { default: null },
  longPress: { default: null },
  pickDown: { default: null },
  pickOut: { default: null },
  pickUp: { default: null },
  pointerOut: { default: null },
  pointerOver: { default: null },
  rightPick: { default: null },
}, 'Action');
