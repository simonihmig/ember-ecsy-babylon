import BaseComponent from 'ember-babylon/BaseComponent';
// @ts-ignore: Ignore import of compiled template
import layout from './template';
import '@babylonjs/loaders/glTF';
import { Entity } from 'ecsy';
import { BabylonCore } from 'ember-babylon/ecsy-babylon/components';
import { AssetContainer, Mesh, SceneLoader } from '@babylonjs/core';
import { restartableTask, task } from 'ember-concurrency-decorators';
import { assert } from '@ember/debug';

interface EcsyBabylonLoadGltfArgs {
  rootUrl: string;
  fileName: string;
}

export default class EcsyBabylonLoadGltf extends BaseComponent<EcsyBabylonLoadGltfArgs> {
  layout = layout;

  // protected
  assets?: {
    meshes: Mesh[];
  };

  // private
  E!: Entity; // core entity instance
  core?: BabylonCore;
  assetContainer?: AssetContainer;

  didInsertElement(): void {
    super.didInsertElement();

    assert('EcsyBabylon entity not found. Make sure to use the yielded version of <LoadGltf/>', !!this.E);
    const core = this.E.getComponent(BabylonCore);
    assert('BabylonCore could not be found', !!core);
    this.set('core', core);

    this.loadModel.perform(this.args.rootUrl, this.args.fileName);
  }

  didUpdateAttrs(): void {
    super.didUpdateAttrs();

    this.loadModel.perform(this.args.rootUrl, this.args.fileName);
  }

  @restartableTask
  loadModel = task(function* (this: EcsyBabylonLoadGltf, rootUrl: string, fileName: string) {
    const {
      scene
    } = this.core;

    this.cleanup();

    const assetContainer = yield SceneLoader.LoadAssetContainerAsync(rootUrl, fileName, scene);
    this.setup(assetContainer);
  });

  setup (ac: AssetContainer) {
    this.set('assetContainer', ac);
    this.set('assets', {
      meshes: ac.meshes,
      materials: ac.materials
    });
  }

  cleanup () {
    this.set('assets', null);
    const ac = this.assetContainer;

    if (ac) {
      this.set('assetContainer', null);
      ac.dispose();
    }
  }

  willDestroy(): void {
    this.loadModel.cancelAll();
    this.cleanup();

    super.willDestroy();
  }
}
