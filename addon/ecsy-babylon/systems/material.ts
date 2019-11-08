import { Entity } from 'ecsy';
import EntityComponent from '@kaliber5/ember-ecsy-babylon/ecsy/components/entity';
import { Mesh, PBRMaterial } from '../components';
import { Mesh as BabylonMesh, PBRMaterial as BabylonPBRMaterial } from '@babylonjs/core';
import { assert } from '@ember/debug';
import { guidFor } from '@ember/object/internals';
import SystemWithCore, { queries } from '../SystemWithCore';

export default class MaterialSystem extends SystemWithCore {
  execute() {
    super.execute();

    this.queries.PBRMaterial.added.forEach((e: Entity) => this.setup(e));
    this.queries.PBRMaterial.changed.forEach((e: Entity) => this.update(e));
    this.queries.PBRMaterial.removed.forEach((e: Entity) => this.remove(e));
  }

  getMesh (entity: Entity, removed = false): BabylonMesh {
    // Optionally allow getting the TransformNode as a removed component.
    // Useful in the case where the entire Entity is being removed.
    const meshComponent = removed
      ? entity.getComponent(Mesh) || entity.getRemovedComponent(Mesh)
      : entity.getComponent(Mesh);

    assert('No valid ECSY Mesh component found on this Entity.', !!(meshComponent && meshComponent.value));

    // @ts-ignore
    return meshComponent.value;
  }

  setup (entity: Entity) {
    const mesh = this.getMesh(entity);
    const materialComponent = entity.getComponent(PBRMaterial);

    // clone the material if it is passed so we can safely dispose it
    const material = materialComponent.value
      ? materialComponent.value.clone(`${guidFor(entity)}__PBRMaterial`)
      : new BabylonPBRMaterial(`${guidFor(entity)}__PBRMaterial`, this.core!.scene);

    Object.assign(material, materialComponent);

    mesh.material = material;
  }

  update (entity: Entity) {
    const mesh = this.getMesh(entity);
    const materialComponent = entity.getComponent(PBRMaterial);

    Object.assign(mesh.material, materialComponent);
  }

  remove (entity: Entity) {
    const mesh = this.getMesh(entity, true);

    if (mesh.material) {
      mesh.material.dispose();
    }

    mesh.material = null;
  }
}

MaterialSystem.queries = {
  ...queries,
  entity: {
    components: [EntityComponent],
    listen: {
      added: true,
      removed: true
    }
  },
  PBRMaterial: {
    components: [Mesh, PBRMaterial],
    listen: {
      added: true,
      changed: true,
      removed: true
    }
  }
};
