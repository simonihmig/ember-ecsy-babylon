import { Entity, System } from 'ecsy';
import BabylonCore from '../components/babylon-core';
import {ArcRotateCamera, Engine, Mesh, Scene, Vector3} from '@babylonjs/core';

const queries = {
  babylon: {
    components: [BabylonCore],
    listen: {
      added: true,
      removed: false
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

// TODO: handle cleanup when removing system
export default class BabylonSystem extends System {
  execute() {
    this.queries.babylon.added.forEach((e: Entity) => this.setupBabylon(e));
    this.queries.meshes.added.forEach((e: Entity) => this.setupMesh(e));
    this.queries.meshes.results.forEach((e: Entity) => this.updateMaterial(e))
  }

  setupBabylon(entity: Entity) {
    const app = entity.getMutableComponent(BabylonCore);

    app.engine = new Engine(app.getCanvas(), true);
    app.scene = new Scene(app.getEngine());
    app.defaultCamera = new ArcRotateCamera('defaultCamera', 0, 0, 100, new Vector3(0, 0, 0), app.scene);

    window.addEventListener(
      'resize',
      () => {
        app.getEngine().resize();
      },
      false
    );
  }

  setupMesh(entity: Entity) {

  }

  updateMaterial(entity: Entity) {

  }
}

BabylonSystem.queries = queries;
