import { Entity } from 'ecsy';
import {ShadowGenerator, DirectionalLight, PointLight, Mesh} from '../components';
import {
  InstancedMesh,
  ShadowGenerator as _ShadowGenerator
} from '@babylonjs/core';
import SystemWithCore, { queries } from '../SystemWithCore';
import { assert } from '@ember/debug';

const shadowGenerators: Set<_ShadowGenerator> = new Set();

export default class ShadowSystem extends SystemWithCore {
  execute() {
    super.execute();

    this.queries.shadowGenerator.added.forEach((e: Entity) => this.setup(e));

    this.queries.mesh.added.forEach((e: Entity) => this.addMesh(e));
    this.queries.mesh.removed.forEach((e: Entity) => this.addMesh(e));

    this.queries.shadowGenerator.removed.forEach((e: Entity) => this.remove(e));

    super.afterExecute();
  }

  getLightComponent(entity: Entity) {
    const component = entity.getMutableComponent(DirectionalLight) || entity.getComponent(PointLight);

    assert('No Light was found on this entity.', component && component.light);

    return component;
  }

  setup(entity: Entity) {
    const lightComponent = this.getLightComponent(entity);
    const light = lightComponent.light!;

    const component = entity.getMutableComponent(ShadowGenerator);
    const {
      value,
      ...options
    } = component;


    const shadowGenerator = new _ShadowGenerator(options.size, light);
    Object.assign(shadowGenerator, options);

    // disable continuous shadow calculation
    //light.autoUpdateExtends = false;
    //shadowGenerator.getShadowMap().refreshRate = RenderTargetTexture.REFRESHRATE_RENDER_ONCE;

    this.core.scene.meshes.forEach(m => {
      // TODO: remove, pass this option to the mesh or primitive directly
      const mesh = m instanceof InstancedMesh ? m.sourceMesh : m;
      mesh.receiveShadows = true;

      shadowGenerator.addShadowCaster(m, false);
    });

    component.value = shadowGenerator;
    shadowGenerators.add(shadowGenerator);
  }

  addMesh(entity: Entity) {
    const meshComponent = entity.getComponent(Mesh);

    if (meshComponent && meshComponent.instance) {
    console.log('adding mesh as caster', meshComponent.instance);
    meshComponent.instance.sourceMesh.receiveShadows = true;
    Array.from(shadowGenerators).forEach(sg => sg.addShadowCaster(meshComponent.instance, false));
    }
  }

  removeMesh(entity: Entity) {
    const component = entity.getMutableComponent(ShadowGenerator);
    const meshComponent = entity.getComponent(Mesh);

    component.value?.removeShadowCaster(meshComponent.instance, false);
  }

  remove(entity: Entity) {
    const component = entity.getRemovedComponent(ShadowGenerator);

    if (component.value) {
      shadowGenerators.delete(component.value);
      component.value.dispose();
      component.value = undefined;
    }
  }
}

ShadowSystem.queries = {
  ...queries,
  shadowGenerator: {
    components: [ShadowGenerator],
    listen: {
      added: true,
      removed: true
    }
  },
  mesh: {
    components: [Mesh],
    listen: {
      added: true,
      removed: true
    }
  },
};
