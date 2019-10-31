import { Entity, System } from 'ecsy';
import { BabylonCore, Mesh, TransformNode } from '../components';
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
    this.queries.meshes.removed.forEach((e: Entity) => this.remove(e, scene));
  }

  setup(entity: Entity, scene: Scene) {
    const meshComponent = entity.getComponent(Mesh);

    if(!meshComponent.value){
      throw new Error('Failed to add Mesh Component. No valid Mesh found.');
    }

    const transformNodeComponent = entity.getComponent(TransformNode);
    meshComponent.value.parent = transformNodeComponent.value;

    scene.addMesh(meshComponent.value);
  }

  remove(entity: Entity, scene: Scene) {
    const meshComponent = entity.getRemovedComponent(Mesh);

    if (!meshComponent || !meshComponent.value) {
      throw new Error('No removed Mesh Component found. Make sure this system is registered at the correct time.');
    }

    if (meshComponent.dispose) {
      meshComponent.value.dispose();
    } else {
      meshComponent.value.parent = null;
      scene.removeMesh(meshComponent.value);
    }
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
