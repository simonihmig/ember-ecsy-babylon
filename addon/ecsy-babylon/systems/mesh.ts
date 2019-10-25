import { Entity, System } from 'ecsy';
import { BabylonCore, Mesh } from '../components';
import { Scene } from '@babylonjs/core';

export default class MeshSystem extends System {
  core?: BabylonCore;

  execute() {
    // TODO: abstract this core querying in a BaseSystem class
    // TODO: this should really exist only once, add check if multiple cores are found
    this.queries.core.added.forEach((e: Entity) => {
      this.core = e.getComponent(BabylonCore);
    });
    this.queries.core.removed.forEach(() => {
      this.core = undefined;
    });

    if (this.core && this.core.scene) {
      const scene = this.core.scene;

      this.queries.meshes.added.forEach((e: Entity) => this.setup(e, scene));
      this.queries.meshes.removed.forEach((e: Entity) => this.remove(e, scene));
    }
  }

  setup(entity: Entity, scene: Scene) {
    console.log('adding mesh');
    const meshComponent = entity.getComponent(Mesh);
    scene.addMesh(meshComponent.value);
  }

  remove(entity: Entity, scene: Scene) {
    console.log('removing mesh', entity);
    const meshComponent = entity.getComponent(Mesh);
    console.log(entity, meshComponent, entity.hasRemovedComponent(Mesh), entity.getRemovedComponent(Mesh));
    scene.removeMesh(meshComponent.value);
  }
}

MeshSystem.queries = {
 core: {
    components: [BabylonCore],
    listen: {
      added: true,
      removed: true
    }
  },
  meshes: {
    components: [Mesh],
    listen: {
      added: true,
      removed: true
    }
  }
};
