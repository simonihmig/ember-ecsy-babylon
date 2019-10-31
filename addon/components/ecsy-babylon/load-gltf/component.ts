import BaseComponent from 'ember-babylon/BaseComponent';
// @ts-ignore: Ignore import of compiled template
import layout from './template';
import '@babylonjs/loaders/glTF';
import { Entity } from 'ecsy';
import { BabylonCore } from 'ember-babylon/ecsy-babylon/components';
import { AssetContainer, SceneLoader } from '@babylonjs/core';
import { restartableTask, task } from 'ember-concurrency-decorators';
import { assert } from '@ember/debug';

interface EcsyBabylonLoadGltfArgs {
  rootUrl: string;
  fileName: string;
}

export default class EcsyBabylonLoadGltf extends BaseComponent<EcsyBabylonLoadGltfArgs> {
  layout = layout;

  // protected
  assetContainer?: AssetContainer;

  // private
  E!: Entity; // core entity instance
  core?: BabylonCore;

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

    if(this.assetContainer){
      this.assetContainer.dispose();
    }

    try {
      const container = yield SceneLoader.LoadAssetContainerAsync(rootUrl, fileName, scene);
      this.set('assetContainer', container);
    } catch(e) {
      throw e;
    }
  });

  // TODO: this does not work properly yet, template context is tracking
  // assetContainer.meshes and dispose sets it without `set`. Might be solved
  // by upgrading to glimmer components and marking assetContainer as tracked.
  willDestroy(): void {
    const ac = this.assetContainer;

    if (ac) {
      // make sure yielded contents are destroyed before disposing
      this.set('assetContainer', null);
      ac.dispose();
    }

    super.willDestroy();
  }
}
