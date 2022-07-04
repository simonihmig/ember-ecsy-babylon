import { Resource } from 'ember-resources';
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
  Named: LoadArgs;
}

export class AssetContainerResource extends Resource<Args> {
  @tracked assets?: AssetContainer | null;
  private _assets?: AssetContainer | null;
  private promise?: Promise<AssetContainer | null>;

  constructor(owner: unknown) {
    super(owner);

    registerDestructor(this, () => this._assets?.dispose());
  }

  modify(_positional: [], { url, scene }: LoadArgs) {
    if (this._assets) {
      this._assets.dispose();
      this.assets = this._assets = undefined;
    }

    if (url) {
      this.load(url, scene);
    }
  }

  @waitFor
  async load(url: string, scene?: Scene): Promise<void> {
    this.promise = this._load(url, scene);
    try {
      const assets = await this.promise;
      this.assets = assets;
      this._assets = assets;
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
): AssetContainerResource {
  return AssetContainerResource.from(destroyable, thunk);
}
