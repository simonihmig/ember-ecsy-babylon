import Component from '@ember/component';
// @ts-ignore: Ignore import of compiled template
import layout from './template';
import '@babylonjs/loaders/glTF';
import { Entity } from 'ecsy';
import { BabylonCore } from 'ember-babylon/ecsy-babylon/components';
import { AssetContainer, SceneLoader } from '@babylonjs/core';

export default class EcsyBabylonLoadGltf extends Component {
  tagName = '';
  layout = layout;

  // public
  rootUrl = '/';
  fileName = '';

  // protected
  assetContainer?: AssetContainer;

  // private
  E!: Entity; // core entity instance
  core?: BabylonCore;

  didInsertElement(): void {
    super.didInsertElement();

    const core = this.E.getComponent(BabylonCore);
    this.set('core', core);

    this.loadModel(this.rootUrl, this.fileName);
  }

  async loadModel(rootUrl: string, fileName: string): Promise<void> {
    const {
      scene
    } = this.core;

    if(this.assetContainer){
      throw new Error(`The assetContainer was already loaded!`);
    }

    try {
      const container = await SceneLoader.LoadAssetContainerAsync(rootUrl, fileName, scene);
      this.set('assetContainer', container);
    } catch(e) {
      throw e;
    }
  }

  willDestroy(): void {
    const ac = this.assetContainer;

    if (ac) {
      // make sure yielded contents are destroyed before disposing
      this.set('assetContainer', null);
      ac.dispose();
    }
  }
}
