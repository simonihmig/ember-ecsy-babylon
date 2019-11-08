import { Entity } from 'ecsy';
import { Mesh, TransformNode } from '../components';
import { Scene } from '@babylonjs/core';
import SystemWithCore, { queries } from "@kaliber5/ember-ecsy-babylon/ecsy-babylon/SystemWithCore";

export default class MeshSystem extends SystemWithCore {
  execute() {
    super.execute();

    const scene = this.core!.scene;
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
  ...queries,
  meshes: {
    components: [Mesh],
    listen: {
      added: true,
      removed: true
    }
  }
};
