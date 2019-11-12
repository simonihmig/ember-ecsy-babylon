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

  @tracked assetContainerHash?: AssetContainerHash;

  private core: BabylonCoreComponent;

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

  @task
  loadModel = task(function* (this: EcsyBabylonLoadGltfs, fileName: string) {
    const {
      scene
    } = this.core;

    let rootUrl; // TODO: try to split from fileName if undefined

    const assetContainer = yield SceneLoader.LoadAssetContainerAsync(rootUrl || '/', fileName, scene);
    return assetContainer;
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
    const oldAch = this.assetContainerHash;
    console.log('setting hash');
    this.assetContainerHash = ach;

    if (oldAch) {
      this.cleanup(oldAch);
    }
  }

  cleanup(ach: AssetContainerHash) {
    Object.values(ach).forEach(ac => ac.dispose());
  }
}
