import DomlessGlimmerComponent, { EcsyBabylonDomlessGlimmerArgs } from '@kaliber5/ember-ecsy-babylon/components/domless-glimmer';
import {assert} from '@ember/debug';
import BabylonCore, { BabylonCoreComponent } from '@kaliber5/ember-ecsy-babylon/ecsy-babylon/components/babylon-core';
import { all } from 'ember-concurrency';
import { restartableTask, task } from 'ember-concurrency-decorators';
import { AssetContainer, SceneLoader } from '@babylonjs/core';
import { tracked } from '@glimmer/tracking';

import '@babylonjs/loaders/glTF';

/**
 * Any other arguments will be parsed as a fileUrl and added to the resulting assets hash
 */
export interface EcsyBabylonLoadGltfsArgs extends EcsyBabylonDomlessGlimmerArgs {
  [key: string]: any;
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
      w,
      parent,
      ...restArgs
    } = args;

    assert('EcsyBabylon entity not found. Make sure to use the yielded version of <LoadGltf/>', !!(w && w.private && w.private.rootEntity));
    const core = w!.private.rootEntity.getComponent(BabylonCore);
    assert('BabylonCore could not be found', !!core);
    this.core = core;

    this.loadModels.perform(restArgs as FileHash);
  }

  didUpdate(changedArgs: Partial<EcsyBabylonLoadGltfsArgs>) {
    if (Object.keys(changedArgs).length) {
      const {
        w,
        parent,
        ...restArgs
      } = changedArgs;

      if (Object.keys(restArgs).length) {
        this.loadModels.perform(restArgs as FileHash);
      }
    }
  }

  willDestroy() {
    super.willDestroy();

    this.loadModels.cancelAll();

    const disposable = Object.values(this.assetContainerHash || {});
    this.assets = undefined;
    this.assetContainerHash = undefined;
    this.cleanup(disposable);
  }

  @task
  loadModel = task(function* (this: EcsyBabylonLoadGltfs, fileUrl: string) {
    const {
      scene
    } = this.core;

    if (fileUrl) {
      try {
        return yield SceneLoader.LoadAssetContainerAsync(fileUrl, '', scene);
      } catch (e) {
        console.error(`Failed to load "${fileUrl}"`);
      }
    }

    return null;
  });

  @restartableTask
  loadModels = task(function* (this: EcsyBabylonLoadGltfs, fileHash: FileHash) {
    const models = Object.values(fileHash).filter(Boolean).map((fileUrl => this.loadModel.perform(fileUrl)));
    const files = yield all(models);

    if (!files) {
      throw new Error('Failed to load files');
    }

    const result = Object.keys(fileHash)
      .reduce((result, name, index) => ({
        ...result,
        [name]: files![index]
      }), {});

    this.setup(result);
  });

  setup(ach: AssetContainerHash) {
    // cleanup old AssetContainers
    const disposable: AssetContainer[] = [];
    Object.entries(this.assetContainerHash || {})
      .forEach(([name, ac]) => {
        if (Object.prototype.hasOwnProperty.call(ach, name) && ac) {
          disposable.push(ac);
        }
      });

    this.assetContainerHash = {
      ...this.assetContainerHash,
      ...ach
    };

    this.assets = Object.entries(this.assetContainerHash)
      .reduce((result, [name, ac]) => {
        const assets = ac
          ? {
            // we only yield meshes and materials for now
            meshes: ac.meshes.filter((m) => m.getTotalVertices() > 0),
            materials: ac.materials
          }
          : null;

        return {
          ...result,
          [name]: assets
        };
      }, {});

    // do the cleanup last to prevent flashing
    this.cleanup(disposable);
  }

  cleanup(assetContainers: AssetContainer[]) {
    assetContainers.forEach(ac => {
      // TODO: hotfix to prevent this component from disposing materials that are not part of the AC
      ac.meshes.forEach(m => m.material = null);
      ac.dispose();
    });
  }
}
