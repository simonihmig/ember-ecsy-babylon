import { Entity } from 'ecsy';
import { Mesh, TransformNode } from '../components';
import SystemWithCore, { queries } from "@kaliber5/ember-ecsy-babylon/ecsy-babylon/SystemWithCore";

export default class MeshSystem extends SystemWithCore {
  execute() {
    super.execute();

    this.queries.meshes.added.forEach((e: Entity) => this.setup(e));
    this.queries.meshes.removed.forEach((e: Entity) => this.remove(e));
  }

  setup(entity: Entity) {
    const meshComponent = entity.getComponent(Mesh);

    if(!meshComponent.value){
      throw new Error('Failed to add Mesh Component. No valid Mesh found.');
    }

    const transformNodeComponent = entity.getComponent(TransformNode);
    meshComponent.value.parent = transformNodeComponent.value;

    this.core.scene.addMesh(meshComponent.value);
  }

  remove(entity: Entity) {
    const meshComponent = entity.getRemovedComponent(Mesh);

    if (!meshComponent || !meshComponent.value) {
      throw new Error('No removed Mesh Component found. Make sure this system is registered at the correct time.');
    }

    if (meshComponent.dispose) {
      meshComponent.value.dispose();
    } else {
      meshComponent.value.parent = null;
      this.core.scene.removeMesh(meshComponent.value);
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
