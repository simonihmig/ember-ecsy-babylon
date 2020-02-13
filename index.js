'use strict';

const EcsyModiferTransform = require('./lib/ast-transform');

module.exports = {
  name: require('./package').name,
  options: {
    autoImport: {
      alias: {
        // explicitly use the ESM build. ember-auto-import will otherwise default to the browser build, which is a
        // gigantic UMD build including all of Babylon.js, not allowing any tree-shaking
        'ecsy-babylon': 'ecsy-babylon/dist/src/index.js',
      },
    },
  },
  setupPreprocessorRegistry(type, registry) {
    const plugin = this._buildPlugin();
    plugin.parallelBabel = {
      requireFile: __filename,
      buildUsing: '_buildPlugin',
      params: {}
    };
    registry.add('htmlbars-ast-plugin', plugin);
  },

  _buildPlugin() {
    return {
      name: 'ember-ecsy-modifier',
      plugin: EcsyModiferTransform,
      baseDir() {
        return __dirname;
      },
      cacheKey() {
        return 'ember-ecsy-modifier';
      }
    };
  },
};
