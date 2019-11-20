import DomlessGlimmerComponent, { EcsyBabylonDomlessGlimmerArgs } from '@kaliber5/ember-ecsy-babylon/components/domless-glimmer';
import { assert } from '@ember/debug';

export interface EcsyBabylonLoadGltfArgs extends EcsyBabylonDomlessGlimmerArgs {
  fileUrl: string;
}

export default class EcsyBabylonLoadGltf extends DomlessGlimmerComponent<EcsyBabylonLoadGltfArgs> {
  constructor(owner: unknown, args: EcsyBabylonLoadGltfArgs) {
    super(owner, args);

    assert(`You must pass a "fileUrl" argument.`, !!args.fileUrl);
  }
}
