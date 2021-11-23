ember-ecsy-babylon
==============================================================================

![CI](https://github.com/kaliber5/ember-ecsy-babylon/workflows/CI/badge.svg)

*WIP*

[Demo](https://kaliber5.github.io/ember-ecsy-babylon/)


Compatibility
------------------------------------------------------------------------------

* Ember.js v3.20 or above
* Ember CLI v3.20 or above
* Node.js v12 or above


Installation
------------------------------------------------------------------------------

```
ember install ember-ecsy-babylon
```


Usage
------------------------------------------------------------------------------

To Do



### Tree shaking

Due to [this ember-auto-import bug](https://github.com/ef4/ember-auto-import/issues/121) 
use direct imports of `ecsy-babylon` systems:

```js
// good
import BabylonSystem from 'ecsy-babylon/systems/babylon';

// bad
import { BabylonSystem } from 'ecsy-babylon/systems';
import { BabylonSystem } from 'ecsy-babylon';
```

Same applies when you import from `@babylonjs/core`, see [Tree Shaking of Babylon.js](https://doc.babylonjs.com/features/es6_support#tree-shaking)

This will pull in only the needed systems, and as such also only the needed parts of `babylon.js`.

Contributing
------------------------------------------------------------------------------

See the [Contributing](CONTRIBUTING.md) guide for details.


License
------------------------------------------------------------------------------

This project is licensed under the [MIT License](LICENSE.md).
