import DomlessGlimmerComponent from '@kaliber5/ember-ecsy-babylon/components/domless-glimmer';
import { assert } from '@ember/debug';
import {
  EcsyBabylonContext,
  EcsyBabylonDomlessGlimmerArgs
} from '@kaliber5/ember-ecsy-babylon/components/ecsy-babylon';

export interface EcsyBabylonLoadGltfArgs extends EcsyBabylonDomlessGlimmerArgs {
  fileUrl: string;
}

export default class EcsyBabylonLoadGltf extends DomlessGlimmerComponent<EcsyBabylonContext, EcsyBabylonLoadGltfArgs> {
  constructor(owner: unknown, args: EcsyBabylonLoadGltfArgs) {
    super(owner, args);

    assert(`You must pass a "fileUrl" argument.`, !!args.fileUrl);
  }
}
