import {Component, createComponentClass} from 'ecsy';

interface BoxComponent extends Component {
  size: number;
  width?: number;
  height?: number;
  depth?: number;
}

export default createComponentClass<BoxComponent>({
  size: { default: 1 },
  width: { default: undefined },
  height: { default: undefined },
  depth: { default: undefined},
}, 'Box');
