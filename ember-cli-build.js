'use strict';

const EmberAddon = require('ember-cli/lib/broccoli/ember-addon');

module.exports = function(defaults) {
  const app = new EmberAddon(defaults, {
    autoImport: {
      alias: {
        // make sure that we use the ES module build, not UMD :/
        // @todo can we enforce that for every app?
        'ecsy-babylon': 'ecsy-babylon/dist/src/index.js'
      }
    }
  });

  /*
    This build file specifies the options for the dummy test app of this
    addon, located in `/tests/dummy`
    This build file does *not* influence how the addon or the app using it
    behave. You most likely want to be modifying `./index.js` or app's build file
  */

  return app.toTree();
};
