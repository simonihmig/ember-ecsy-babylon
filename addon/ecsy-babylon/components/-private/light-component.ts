import { Component } from 'ecsy';

export interface LightComponent extends Component {
  intensity: number;
}

export const schema = {
  intensity: { default: 1 },
};
