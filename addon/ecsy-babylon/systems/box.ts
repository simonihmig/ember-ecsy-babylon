import { Entity, System } from 'ecsy';
import { Box, Mesh } from '../components';
import { BoxBuilder } from '@babylonjs/core';

export default class BoxSystem extends System {
  execute() {
    this.queries.boxes.added.forEach((e: Entity) => this.setup(e));
    this.queries.boxes.removed.forEach((e: Entity) => this.remove(e))
  }

  setup(entity: Entity) {
    const boxComponent = entity.getComponent(Box);
    const mesh = BoxBuilder.CreateBox('my_box', boxComponent, null);

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

BoxSystem.queries = {
  boxes: {
    components: [Box],
    listen: {
      added: true,
      removed: true
    }
  }
};
