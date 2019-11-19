import { helper } from '@ember/component/helper';
import { WDefinition } from '@kaliber5/ember-ecsy-babylon/components/domless-glimmer';
import { assert } from '@ember/debug';

export function mergeW([W, newW]: [WDefinition, Partial<WDefinition>]/*, hash*/) {
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
