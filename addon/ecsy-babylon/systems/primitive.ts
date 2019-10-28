import { ComponentConstructor, Entity, System } from 'ecsy';
import { Box, Mesh, Sphere } from '../components';
import { BoxBuilder, Mesh as _Mesh, SphereBuilder } from '@babylonjs/core';

export default class PrimitiveSystem extends System {
  execute() {
    this.queries.boxes.added.forEach((e: Entity) => this.setup(e, Box, BoxBuilder.CreateBox));
    this.queries.spheres.added.forEach((e: Entity) => this.setup(e, Sphere, SphereBuilder.CreateSphere));

    this.queries.boxes.removed.forEach((e: Entity) => this.remove(e));
    this.queries.spheres.removed.forEach((e: Entity) => this.remove(e))
  }

  setup(entity: Entity, Component: ComponentConstructor<any>, CreatePrimitive: (name: string, options: any, scene?: any) => _Mesh) {
    const component = entity.getComponent(Component);
    const mesh = CreatePrimitive(component.name, component);

    // remove mesh from its default scene
    const scene = mesh.getScene();
    if (scene) {
      scene.removeMesh(mesh);
    }

    entity.addComponent(Mesh, { value: mesh });
  }

  remove(entity: Entity) {
    entity.removeComponent(Mesh);
  }
}

PrimitiveSystem.queries = {
  boxes: {
    components: [Box],
    listen: {
      added: true,
      removed: true
    }
  },
  spheres: {
    components: [Sphere],
    listen: {
      added: true,
      removed: true
    }
  }
};
