import DomlessGlimmerComponent, { DomlessGlimmerArgs } from '@kaliber5/ember-ecsy-babylon/components/domless-glimmer';
import { Entity } from 'ecsy';
import {assert} from '@ember/debug';
import BabylonCore, { BabylonCoreComponent } from '@kaliber5/ember-ecsy-babylon/ecsy-babylon/components/babylon-core';
import { all } from 'ember-concurrency';
import { restartableTask, task } from 'ember-concurrency-decorators';
import { AssetContainer, SceneLoader } from '@babylonjs/core';
import { tracked } from '@glimmer/tracking';

interface EcsyBabylonLoadGltfsArgs extends DomlessGlimmerArgs {
  e: Entity; // core entity instance
}

type FileHash = {
  [index: string]: string;
};

type AssetContainerHash = {
  [index: string]: AssetContainer;
}


export default class EcsyBabylonLoadGltfs extends DomlessGlimmerComponent<EcsyBabylonLoadGltfsArgs> {

  @tracked assets?: object;

  private core: BabylonCoreComponent;
  private assetContainerHash?: AssetContainerHash;

  constructor(owner: unknown, args: EcsyBabylonLoadGltfsArgs) {
    super(owner, args);

    const {
      e,
      ..._args
    } = args;

    assert('EcsyBabylon entity not found. Make sure to use the yielded version of <LoadGltf/>', !!e);
    const core = e.getComponent(BabylonCore);
    assert('BabylonCore could not be found', !!core);
    this.core = core;

    this.loadModels.perform(_args);
  }

  didUpdate(changedArgs: Partial<EcsyBabylonLoadGltfsArgs>) {
    if (Object.keys(changedArgs).length) {
      const {
        e,
        ..._changedArgs
      } = changedArgs;

      this.loadModels.perform(_changedArgs);
    }
  }

  willDestroy() {
    this.loadModels.cancelAll();

    const disposable = Object.values(this.assetContainerHash || {});
    this.assets = undefined;
    this.assetContainerHash = undefined;
    this.cleanup(disposable);

    super.willDestroy();
  }

  @task
  loadModel = task(function* (this: EcsyBabylonLoadGltfs, fileName: string) {
    const {
      scene
    } = this.core;

    let rootUrl; // TODO: try to split from fileName if undefined

    return yield SceneLoader.LoadAssetContainerAsync(rootUrl || '/', fileName, scene);
  });

  @restartableTask
  loadModels = task(function* (this: EcsyBabylonLoadGltfs, fileHash: FileHash) {
    const models = Object.values(fileHash).map((fileName => this.loadModel.perform(fileName)));
    const files = yield all(models);
    const result = Object.keys(fileHash)
      .reduce((result, name, index) => ({
        ...result,
        [name]: files[index]
      }), {});

    this.setup(result);
  });

  setup(ach: AssetContainerHash) {
    console.log('setting up', ach);

    // cleanup old AssetContainers
    const disposable: AssetContainer[] = [];
    Object.entries(this.assetContainerHash || {})
      .forEach(([name, ac]) => {
        if (ach.hasOwnProperty(name)) {
          disposable.push(ac);
        }
      });

    this.assetContainerHash = {
      ...this.assetContainerHash,
      ...ach
    };

    this.assets = Object.entries(this.assetContainerHash)
      .reduce((result, [name, ac]) => ({
        ...result,
        [name]: {
          // we only yield meshes and materials for now
          meshes: ac.meshes,
          materials: ac.materials
        }
      }), {});

    // do the cleanup last to prevent flashing
    this.cleanup(disposable);
  }

  cleanup(assetContainers: AssetContainer[]) {
    assetContainers.forEach(ac => ac.dispose());
  }
}
