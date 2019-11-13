import DomlessGlimmerComponent, { DomlessGlimmerArgs } from '@kaliber5/ember-ecsy-babylon/components/domless-glimmer';
import { Color3, Scene } from '@babylonjs/core';
import { assert } from '@ember/debug';
import BabylonCore from '@kaliber5/ember-ecsy-babylon/ecsy-babylon/components/babylon-core';
import { Entity, World } from 'ecsy';

export interface EcsyBabylonSceneArgs extends DomlessGlimmerArgs {
  e: Entity;
  w: World;
  createEntity: World['createEntity'];

  clearColor: Color3;
  ambientColor: Color3;
}

export default class EcsyBabylonScene extends DomlessGlimmerComponent<EcsyBabylonSceneArgs> {
  scene: Scene;

  constructor (owner: unknown, args: EcsyBabylonSceneArgs) {
    super(owner, args);

    const {
      e,
      w,
      createEntity,
      ...restArgs
    } = args;

    assert('EcsyBabylon entity not found. Make sure to use the yielded version of <LoadGltf/>', !!e);
    assert('EcsyBabylon world not found. Make sure to use the yielded version of <LoadGltf/>', !!w);
    const core = e.getComponent(BabylonCore);
    assert('BabylonCore could not be found', !!core);
    assert('BabylonCore does not contain a scene', !!core.scene);

    this.scene = core.scene;
    Object.assign(this.scene, restArgs);
  }

  didUpdate (changedArgs: Partial<EcsyBabylonSceneArgs>) {
    super.didUpdate(changedArgs);

    Object.assign(this.scene, changedArgs);
  }
}
