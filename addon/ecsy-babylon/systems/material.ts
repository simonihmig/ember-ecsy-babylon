import { Entity, System } from 'ecsy';
import EntityComponent from 'ember-babylon/ecsy/components/entity';
import { Mesh, PBRMaterial } from '../components';
import { Mesh as BabylonMesh } from '@babylonjs/core';
import { assert } from '@ember/debug';

export default class MaterialSystem extends System {
  execute() {
    this.queries.PBRMaterial.added.forEach((e: Entity) => this.material(e));
    this.queries.PBRMaterial.changed.forEach((e: Entity) => this.material(e));
    this.queries.PBRMaterial.removed.forEach((e: Entity) => this.removeMaterial(e));
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

  material (entity: Entity) {
    const mesh = this.getMesh(entity);
    const materialComponent = entity.getComponent(PBRMaterial);
    mesh.material = materialComponent.value;
  }

  removeMaterial (entity: Entity) {
    const mesh = this.getMesh(entity, true);
    const material = mesh.material;
    material.dispose();
    mesh.material = null;
  }
}

TransformSystem.queries = {
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
