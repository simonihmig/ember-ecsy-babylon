import DomlessGlimmerComponent, { DomlessGlimmerArgs } from '@kaliber5/ember-ecsy-babylon/components/domless-glimmer';
import '@babylonjs/loaders/glTF';
import { Entity } from 'ecsy';
import BabylonCore, { BabylonCoreComponent } from '@kaliber5/ember-ecsy-babylon/ecsy-babylon/components/babylon-core';
import { AssetContainer, AbstractMesh, SceneLoader } from '@babylonjs/core';
import { restartableTask, task } from 'ember-concurrency-decorators';
import { assert } from '@ember/debug';
import { tracked } from '@glimmer/tracking';

interface EcsyBabylonLoadGltfArgs extends DomlessGlimmerArgs {
  E: Entity; // core entity instance
  rootUrl: string;
  fileName: string;
}

export default class EcsyBabylonLoadGltf extends DomlessGlimmerComponent<EcsyBabylonLoadGltfArgs> {
  // protected
  @tracked assets?: {
    meshes: AbstractMesh[];
  };

  // private
  core: BabylonCoreComponent;
  assetContainer?: AssetContainer;

  constructor(owner: unknown, args: EcsyBabylonLoadGltfArgs) {
    super(owner, args);

    const {
      E,
      rootUrl,
      fileName
    } = args;

    assert('EcsyBabylon entity not found. Make sure to use the yielded version of <LoadGltf/>', !!E);
    const core = E.getComponent(BabylonCore);
    assert('BabylonCore could not be found', !!core);
    this.core = core;

    this.loadModel.perform(rootUrl, fileName);
  }

  didUpdate(changedArgs: Partial<EcsyBabylonLoadGltfArgs>): void {
    super.didUpdate(changedArgs);

    if (changedArgs.rootUrl || changedArgs.fileName) {
      this.loadModel.perform(this.args.rootUrl, this.args.fileName);
    }
  }

  @restartableTask
  loadModel = task(function* (this: EcsyBabylonLoadGltf, rootUrl: string, fileName: string) {
    const {
      scene
    } = this.core;

    this.cleanup();

    const assetContainer = yield SceneLoader.LoadAssetContainerAsync(rootUrl || '/', fileName, scene);
    this.setup(assetContainer);
  });

  setup (ac: AssetContainer) {
    this.assetContainer = ac;
    this.assets = {
      meshes: ac.meshes,
      //materials: ac.materials
    };
  }

  cleanup () {
    this.assets = undefined;
    const ac = this.assetContainer;

    if (ac) {
      this.assetContainer = undefined;
      ac.dispose();
    }
  }

  willDestroy(): void {
    this.loadModel.cancelAll();
    this.cleanup();

    super.willDestroy();
  }
}
