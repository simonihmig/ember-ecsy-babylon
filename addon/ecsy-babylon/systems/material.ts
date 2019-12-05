import { Entity } from 'ecsy';
import EntityComponent from '@kaliber5/ember-ecsy-babylon/ecsy/components/entity';
import { Mesh, PBRMaterial, Material, ShadowOnlyMaterial } from '../components';
import { Mesh as BabylonMesh, PBRMaterial as BabylonPBRMaterial } from '@babylonjs/core';
import { ShadowOnlyMaterial as BabylonShadowOnlyMaterial } from '@babylonjs/materials';
import { assert } from '@ember/debug';
import { guidFor } from '@ember/object/internals';
import SystemWithCore, { queries } from '../SystemWithCore';

export default class MaterialSystem extends SystemWithCore {
  execute() {
    super.execute();

    this.queries.ShadowOnlyMaterial.added.forEach((e: Entity) => this.setupShadowOnlyMaterial(e));
    this.queries.ShadowOnlyMaterial.removed.forEach((e: Entity) => this.removeMaterial(e));

    this.queries.PBRMaterial.added.forEach((e: Entity) => this.setupPBRMaterial(e));
    this.queries.PBRMaterial.changed.forEach((e: Entity) => this.updatePBRMaterial(e));
    this.queries.PBRMaterial.removed.forEach((e: Entity) => this.removeMaterial(e));

    this.queries.Material.removed.forEach((e: Entity) => this.remove(e));
    this.queries.Material.added.forEach((e: Entity) => this.setup(e));
    this.queries.Material.changed.forEach((e: Entity) => this.setup(e));

    super.afterExecute();
  }

  hasMesh (entity: Entity, removed = false): boolean {
    const component = removed
      ? entity.getComponent(Mesh) || entity.getRemovedComponent(Mesh)
      : entity.getComponent(Mesh);

    return !!component?.value;
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
    const materialComponent = entity.getComponent(Material);

    if (materialComponent.value) {
      const {
        value,
        ...restArgs
      } = materialComponent;

      Object.assign(value, restArgs);
      mesh.material = value;
    } else {
      console.warn(`No material was applied to mesh "${mesh.name}".`);
    }
  }

  remove (entity: Entity) {
    // remove mesh from material if there still is one
    if (this.hasMesh(entity, true)) {
      const mesh = this.getMesh(entity, true);

      if (mesh.material) {
        mesh.material = null;
      }
    }

    const material = entity.getRemovedComponent(Material);

    if (material.value) {
      material.value.dispose();
      material.value = null;
    }
  }

  setupPBRMaterial (entity: Entity) {
    const materialComponent = entity.getComponent(PBRMaterial);

    const material = new BabylonPBRMaterial(`${guidFor(entity)}__PBRMaterial`, this.core.scene);
    Object.assign(material, materialComponent);

    entity.addComponent(Material, { value: material });
  }

  updatePBRMaterial (entity: Entity) {
    const mesh = this.getMesh(entity);
    const materialComponent = entity.getComponent(PBRMaterial);

    Object.assign(mesh.material, materialComponent);
  }

  setupShadowOnlyMaterial (entity: Entity) {
    const materialComponent = entity.getComponent(ShadowOnlyMaterial);

    const material = new BabylonShadowOnlyMaterial(`${guidFor(entity)}__ShadowOnlyMaterial`, this.core.scene);
    Object.assign(material, materialComponent);

    entity.addComponent(Material, { value: material });
  }

  removeMaterial (entity: Entity) {
    entity.removeComponent(Material);
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
  Material: {
    components: [Mesh, Material],
    listen: {
      added: true,
      changed: true,
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
  },
  ShadowOnlyMaterial: {
    components: [Mesh, ShadowOnlyMaterial],
    listen: {
      added: true,
      removed: true,
    }
  }
};
