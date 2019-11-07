import { Entity, System } from 'ecsy';
import EntityComponent from 'ember-babylon/ecsy/components/entity';
import { BabylonCore, Mesh, PBRMaterial } from '../components';
import { Mesh as BabylonMesh, PBRMaterial as BabylonPBRMaterial, Scene } from '@babylonjs/core';
import { assert } from '@ember/debug';
import { guidFor } from '@ember/object/internals';
import { BabylonCoreComponent } from 'ember-babylon/ecsy-babylon/components/babylon-core';

export default class MaterialSystem extends System {
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
    this.queries.PBRMaterial.added.forEach((e: Entity) => this.setup(e, scene));
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

  setup (entity: Entity, scene: Scene) {
    const mesh = this.getMesh(entity);
    const materialComponent = entity.getComponent(PBRMaterial);

    // clone the material if it is passed so we can safely dispose it
    const material = materialComponent.value
      ? materialComponent.value.clone(`${guidFor(entity)}__PBRMaterial`)
      : new BabylonPBRMaterial(`${guidFor(entity)}__PBRMaterial`, scene);

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
  core: {
    components: [BabylonCore],
    listen: {
      added: true,
      removed: true
    }
  },
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
