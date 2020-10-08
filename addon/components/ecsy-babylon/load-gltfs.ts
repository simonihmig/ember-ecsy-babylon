import DomlessGlimmerComponent from 'ember-ecsy-babylon/components/domless-glimmer';
import {assert} from '@ember/debug';
import BabylonCore from 'ecsy-babylon/components/babylon-core';
import { TaskGenerator, hash } from 'ember-concurrency';
import { restartableTask, task } from 'ember-concurrency-decorators';
import { perform, taskFor } from 'ember-concurrency-ts';
import { tracked } from '@glimmer/tracking';
import { GLTFFileLoader } from '@babylonjs/loaders/glTF/glTFFileLoader';
import '@babylonjs/loaders/glTF/2.0/glTFLoader';
import {
  EcsyBabylonContext,
  EcsyBabylonDomlessGlimmerArgs
} from 'ember-ecsy-babylon/components/ecsy-babylon';
import { AssetContainer } from '@babylonjs/core/assetContainer';
import { SceneLoader } from '@babylonjs/core/Loading/sceneLoader';

SceneLoader.RegisterPlugin(new GLTFFileLoader());

/**
 * Any other arguments will be parsed as a fileUrl and added to the resulting assets hash
 */
export interface EcsyBabylonLoadGltfsArgs extends EcsyBabylonDomlessGlimmerArgs {
  files: FileHash;
}

type FileHash = {
  [index: string]: string;
};

type AssetContainerHash = {
  [index: string]: AssetContainer;
}

export default class EcsyBabylonLoadGltfs extends DomlessGlimmerComponent<EcsyBabylonContext, EcsyBabylonLoadGltfsArgs> {

  @tracked assets?: object;

  private core: BabylonCore;
  private assetContainerHash?: AssetContainerHash;
  private fileHash: FileHash;

  constructor(owner: unknown, args: EcsyBabylonLoadGltfsArgs) {
    super(owner, args);

    assert('EcsyBabylon entity not found. Make sure to use the yielded version of <World.LoadGltfs>', !!(this.context && this.context.rootEntity));
    const core = this.context!.rootEntity.getComponent(BabylonCore);
    assert('BabylonCore could not be found', !!core);
    this.core = core!;

    this.fileHash = this.args.files;
    perform(this.loadModels, this.args.files);
  }

  didUpdate(changedArgs: Partial<EcsyBabylonLoadGltfsArgs>): void {
    if (changedArgs.files) {
      // determine changed files to only load those
      const { files } = this.args;
      const filesDiff = Object.keys(files)
        .filter((key) => files[key] !== this.fileHash[key])
        .reduce((result, key) => ({...result, [key]: files[key]}), {});

      this.fileHash = files;
      if (Object.keys(filesDiff).length > 0) {
        perform(this.loadModels, filesDiff);
      }
    }
  }

  willDestroy(): void {
    super.willDestroy();

    taskFor(this.loadModels).cancelAll();

    const disposable = Object.values(this.assetContainerHash || {});
    this.assets = undefined;
    this.assetContainerHash = undefined;
    this.cleanup(disposable);
  }

  @task
  *loadModel(this: EcsyBabylonLoadGltfs, fileUrl: string): TaskGenerator<AssetContainer | null> {
    const {
      scene
    } = this.core;

    if (fileUrl) {
      try {
        return yield SceneLoader.LoadAssetContainerAsync(fileUrl, '', scene, undefined, '.gltf');
      } catch (e) {
        console.error(`Failed to load "${fileUrl}": ${e.message}`);
      }
    }

    return null;
  }

  @restartableTask
  *loadModels(this: EcsyBabylonLoadGltfs, fileHash: FileHash): TaskGenerator<void> {
    const models = Object
      .entries(fileHash)
      .reduce((result, [key, fileUrl]) => ({
         ...result,
        [key]: perform(this.loadModel, fileUrl)
      }), {});
    const files = yield hash(models);

    if (!files) {
      throw new Error('Failed to load files');
    }

    this.setup(files);
  }

  setup(ach: AssetContainerHash): void {
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

    // do the cleanup after the frame has rendered, to allow essy systems to do their cleanup first
    // e.g. when adding child nodes to an asset mesh, `ac.dispose()` would also recursively dispose those nodes not owned by
    // our asset container
    this.core.engine.onEndFrameObservable.addOnce(() => this.cleanup(disposable))
  }

  cleanup(assetContainers: AssetContainer[]): void {
    assetContainers.forEach(ac => {
      ac.dispose();
    });
  }
}
