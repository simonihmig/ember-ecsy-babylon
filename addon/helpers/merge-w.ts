import { helper } from '@ember/component/helper';
import { WDefinition } from '@kaliber5/ember-ecsy-babylon/components/domless-glimmer';

export function mergeW([W, newW]: [WDefinition, Partial<WDefinition>]/*, hash*/) {
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
