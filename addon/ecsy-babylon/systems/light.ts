import { ComponentConstructor, Entity, System} from 'ecsy';
import { HemisphericLight, PointLight, TransformNode } from '../components';
import { HemisphericLight as _HemisphericLight, PointLight as _PointLight, Light } from '@babylonjs/core';

export interface LightConstructor<T extends Light> {
  new (...args: any): T;
}

export default class LightSystem extends System {
  execute() {
    this.queries.hemisphericLight.added.forEach((e: Entity) => this.setup(e, HemisphericLight, _HemisphericLight));
    this.queries.pointLight.added.forEach((e: Entity) => this.setup(e, PointLight, _PointLight));

    this.queries.hemisphericLight.removed.forEach((e: Entity) => this.remove(e, HemisphericLight));
    this.queries.pointLight.removed.forEach((e: Entity) => this.remove(e, PointLight));
  }

  setup(entity: Entity, Component: ComponentConstructor<any>, _Light: LightConstructor<any>) {
    const component = entity.getMutableComponent(Component);
    const {
      light,
      ...options
    } = component;

    component.light = new _Light(component.name);
    Object.assign(component.light, options);

    const transformNodeComponent = entity.getComponent(TransformNode);
    component.light.parent = transformNodeComponent.value;
  }

  remove(entity: Entity, Component: ComponentConstructor<any>) {
    const component = entity.getRemovedComponent(Component);
    component.light.dispose();
  }
}

LightSystem.queries = {
  hemisphericLight: {
    components: [HemisphericLight],
    listen: {
      added: true,
      removed: true
    }
  },
  pointLight: {
    components: [PointLight],
    listen: {
      added: true,
      removed: true
    }
  }
};