import DomlessGlimmerComponent, {
  EcsyBabylonDomlessGlimmerArgs,
  EcsyContext
} from '@kaliber5/ember-ecsy-babylon/components/domless-glimmer';
import { Color3, CubeTexture, Scene } from '@babylonjs/core';
import { assert } from '@ember/debug';
import BabylonCore from '@kaliber5/ember-ecsy-babylon/ecsy-babylon/components/babylon-core';

export interface EcsyBabylonSceneArgs extends EcsyBabylonDomlessGlimmerArgs {
  clearColor: Color3;
  ambientColor: Color3;
  environmentTexture: string;
}

export default class EcsyBabylonScene extends DomlessGlimmerComponent<EcsyBabylonSceneArgs> {
  scene: Scene;

  constructor (owner: unknown, args: EcsyBabylonSceneArgs) {
    super(owner, args);

    const {
      w,
      environmentTexture,
      ...restArgs
    } = args;

    assert(`Argument "w" not passed. Make sure to use the yielded version of <Scene/>`, !!w);

    const {
      world,
      private: {
        rootEntity
      }
    } = w as EcsyContext;

    assert('EcsyBabylon entity not found. Make sure to use the yielded version of <Scene/>', !!rootEntity);
    assert('EcsyBabylon world not found. Make sure to use the yielded version of <Scene/>', !!world);
    const core = rootEntity.getComponent(BabylonCore);
    assert('BabylonCore could not be found', !!core);
    assert('BabylonCore does not contain a scene', !!core.scene);

    this.scene = core.scene;
    Object.assign(this.scene, restArgs);
    this.updateEnvironmentTexture(environmentTexture);
  }

  didUpdate (changedArgs: Partial<EcsyBabylonSceneArgs>) {
    super.didUpdate(changedArgs);

    const {
      w,
      environmentTexture,
      ...restArgs
    } = changedArgs;

    if (Object.keys(restArgs).length) {
      Object.assign(this.scene, changedArgs);
    }

    if (environmentTexture) {
      this.updateEnvironmentTexture(environmentTexture);
    }
  }

  updateEnvironmentTexture(environmentTexture: string) {
    const oldTexture = this.scene.environmentTexture;

    this.scene.environmentTexture = new CubeTexture(environmentTexture, this.scene);

    if (oldTexture) {
      oldTexture.dispose();
    }
  }

  willDestroy() {
    if (this.scene.environmentTexture) {
      this.scene.environmentTexture.dispose();
      this.scene.environmentTexture = null;
    }

    super.willDestroy();
  }
}
