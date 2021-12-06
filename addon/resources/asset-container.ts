import { Resource, useResource } from 'ember-resources';
import { AssetContainer } from '@babylonjs/core/assetContainer';
import { waitFor } from '@ember/test-waiters';
import { SceneLoader } from '@babylonjs/core/Loading/sceneLoader';
import { Scene } from '@babylonjs/core/scene';
import { tracked } from '@glimmer/tracking';
import { registerDestructor } from '@ember/destroyable';

interface LoadArgs {
  url?: string | null;
  scene?: Scene;
}

interface Args {
  named: LoadArgs;
}

export class AssetContainerResource extends Resource<Args> {
  @tracked assets?: AssetContainer | null;
  promise?: Promise<AssetContainer | null>;

  constructor(owner: unknown, args: Args, previous: AssetContainerResource) {
    super(owner, args, previous);

    const { url, scene } = args.named;
    if (url) {
      this.load(url, scene);
    }

    registerDestructor(this, () => this.assets?.dispose());
  }

  @waitFor
  async load(url: string, scene?: Scene): Promise<void> {
    this.promise = this._load(url, scene);
    try {
      this.assets = await this.promise;
    } catch (e) {
      console.error(
        `Failed to load asset container from URL "${url}": ${e.message}`
      );
      this.assets = null;
    }
  }

  private async _load(
    url: string,
    scene?: Scene
  ): Promise<AssetContainer | null> {
    return SceneLoader.LoadAssetContainerAsync(url, '', scene);
  }
}

export function loadAssetContainer(
  destroyable: object,
  thunk?: () => LoadArgs
) {
  return useResource(destroyable, AssetContainerResource, thunk);
}
