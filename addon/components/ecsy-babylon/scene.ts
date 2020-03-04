import DomlessGlimmerComponent from 'ember-ecsy-babylon/components/domless-glimmer';
import { Color3, CubeTexture, Matrix } from '@babylonjs/core';
import { assert } from '@ember/debug';
import { BabylonCore } from 'ecsy-babylon';
import {
  EcsyBabylonContext, EcsyBabylonDomlessGlimmerArgs
} from 'ember-ecsy-babylon/components/ecsy-babylon';

export interface EcsyBabylonSceneArgs extends EcsyBabylonDomlessGlimmerArgs {
  clearColor?: Color3;
  ambientColor?: Color3;
  environmentTexture?: string;
  environmentRotation?: number;
}

export default class EcsyBabylonScene extends DomlessGlimmerComponent<EcsyBabylonContext, EcsyBabylonSceneArgs> {
  // @todo fix typing when we have native classes in ecsy-babylon/components
  scene: any;

  constructor (owner: unknown, args: EcsyBabylonSceneArgs) {
    super(owner, args);

    const {
      environmentTexture,
      environmentRotation,
      ...restArgs
    } = args;

    assert('No ECSY context found.', this.context);

    const {
      world,
      rootEntity
    } = this.context!;

    assert('EcsyBabylon entity not found. Make sure to use the yielded version of <Scene/>', !!rootEntity);
    assert('EcsyBabylon world not found. Make sure to use the yielded version of <Scene/>', !!world);
    const core = rootEntity.getComponent(BabylonCore);
    assert('BabylonCore could not be found', !!core);
    assert('BabylonCore does not contain a scene', !!core.scene);

    this.scene = core.scene;
    Object.assign(this.scene, restArgs);
    this.updateEnvironmentTexture(environmentTexture);
    this.rotateEnvironmentTexture(environmentRotation);
  }

  didUpdate (changedArgs: Partial<EcsyBabylonSceneArgs>) {
    super.didUpdate(changedArgs);

    const {
      environmentTexture,
      environmentRotation,
      ...restArgs
    } = changedArgs;

    if (Object.keys(restArgs).length) {
      Object.assign(this.scene, changedArgs);
    }

    if (environmentTexture) {
      this.updateEnvironmentTexture(environmentTexture);
    }
    if (environmentRotation) {
      this.rotateEnvironmentTexture(environmentRotation);
    }
  }

  updateEnvironmentTexture(environmentTexture?: string) {
    const oldTexture = this.scene.environmentTexture;

    this.scene.environmentTexture = environmentTexture ? new CubeTexture(environmentTexture, this.scene) : null;

    if (oldTexture) {
      oldTexture.dispose();
    }
  }

  rotateEnvironmentTexture(angle = 0) {
    const texture = this.scene.environmentTexture;
    texture.setReflectionTextureMatrix(
      Matrix.RotationY(
        angle
      )
    );
  }

  willDestroy() {
    if (this.scene.environmentTexture) {
      this.scene.environmentTexture.dispose();
      this.scene.environmentTexture = null;
    }

    super.willDestroy();
  }
}
