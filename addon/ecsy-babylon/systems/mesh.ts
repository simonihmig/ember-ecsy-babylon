import { Entity, System } from 'ecsy';
import { BabylonCore, Mesh, Transformable } from '../components';
import { Scene } from '@babylonjs/core';
import { BabylonCoreComponent } from '../components/babylon-core';

export default class MeshSystem extends System {
  core?: BabylonCoreComponent;

  execute() {
    // TODO: abstract this core querying in a BaseSystem class
    // TODO: this should really exist only once, add check if multiple cores are found
    this.queries.core.added.forEach((e: Entity) => {
      this.core = e.getComponent(BabylonCore);
    });
    this.queries.core.removed.forEach(() => {
      this.core = undefined;
    });

    if(!this.core || !this.core.scene) {
      throw new Error('No BabylonCore Component found. Have you instantiated the right Root Ecsy component?');
    }

    const scene = this.core.scene;
    this.queries.meshes.added.forEach((e: Entity) => this.setup(e, scene));
    this.queries.meshes.removed.forEach((e: Entity) => this.remove(e));
  }

  setup(entity: Entity, scene: Scene) {
    const meshComponent = entity.getComponent(Mesh);

    if(!meshComponent.value){
      throw new Error('Failed to add Mesh Component. No valid Mesh found.');
    }

    scene.addMesh(meshComponent.value);
    entity.addComponent(Transformable);
  }

  remove(entity: Entity) {
    const meshComponent = entity.getRemovedComponent(Mesh);

    if (!meshComponent || !meshComponent.value) {
      throw new Error('No removed Mesh Component found. Make sure this system is registered at the correct time.');
    }

    entity.removeComponent(Transformable);
    meshComponent.value.dispose();
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
