import { helper } from '@ember/component/helper';
import { EcsyContext } from '@kaliber5/ember-ecsy-babylon/components/domless-glimmer';
import { assert } from '@ember/debug';

export function mergeW([W, newW]: [EcsyContext, Partial<EcsyContext>]/*, hash*/) {
  assert('Two arguments of type "WDefinition" must be passed', W && newW);

  return {
    ...W,
    ...newW,
    private: {
      ...W.private,
      ...newW.private
    }
  };
}

export default helper(mergeW);
