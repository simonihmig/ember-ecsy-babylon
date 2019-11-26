import { Entity } from 'ecsy';
import { Mesh, TransformNode } from '../components';
import SystemWithCore, { queries } from '../SystemWithCore';

export default class MeshSystem extends SystemWithCore {
  execute() {
    super.execute();

    this.queries.meshes.added.forEach((e: Entity) => this.setup(e));
    this.queries.meshes.removed.forEach((e: Entity) => this.remove(e));

    super.afterExecute();
  }

  setup(entity: Entity) {
    const meshComponent = entity.getComponent(Mesh);

    if(!meshComponent.value){
      throw new Error('Failed to add Mesh Component. No valid Mesh found.');
    }

    // We're using an instance here because we cannot reliably undo the internal transformations that happen when
    // parenting/un-parenting a mesh. An instance of a mesh has the identical geometry and properties of the original
    // but with its own position, rotation, scaling meaning the original won't be touched.
    meshComponent.instance = meshComponent.value.createInstance(`${meshComponent.value.name}__instance`);

    const transformNodeComponent = entity.getComponent(TransformNode);
    meshComponent.instance.parent = transformNodeComponent.value;
    meshComponent.instance.computeWorldMatrix(true);

    const {
      value,
      dispose,
      instance,
      ...restArgs
    } = meshComponent;

    Object.assign(instance, restArgs);

    this.core.scene.addMesh(meshComponent.instance);
  }

  remove(entity: Entity) {
    const meshComponent = entity.getRemovedComponent(Mesh);

    if (!meshComponent || !meshComponent.instance) {
      throw new Error('No removed Mesh Component found. Make sure this system is registered at the correct time.');
    }

    meshComponent.instance.dispose();
    meshComponent.instance = null;
    // TODO: Ember component is not setting "value" again when its removed/added in a single runloop so we cannot clean.
    //meshComponent.value = null;
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
