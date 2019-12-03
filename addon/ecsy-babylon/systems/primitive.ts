import { ComponentConstructor, Entity, System } from 'ecsy';
import { Box, Mesh, Sphere } from '../components';
import { BoxBuilder, Mesh as BabylonMesh, SphereBuilder } from '@babylonjs/core';

export default class PrimitiveSystem extends System {
  execute() {
    this.queries.boxes.added.forEach((e: Entity) => this.setup(e, Box, BoxBuilder.CreateBox));
    this.queries.spheres.added.forEach((e: Entity) => this.setup(e, Sphere, SphereBuilder.CreateSphere));

    this.queries.boxes.removed.forEach((e: Entity) => this.remove(e));
    this.queries.spheres.removed.forEach((e: Entity) => this.remove(e))
  }

  setup(entity: Entity, Component: ComponentConstructor<any>, createPrimitive: (name: string, options: any, scene?: any) => BabylonMesh) {
    const component = entity.getComponent(Component);
    const mesh = createPrimitive(component.name || 'primitive', component);

    // remove mesh from its default scene
    const scene = mesh.getScene();
    if (scene) {
      scene.removeMesh(mesh);
    }

    entity.addComponent(Mesh, { value: mesh, dispose: true });
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
