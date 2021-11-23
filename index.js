'use strict';

const EcsyModiferTransform = require('./lib/ast-transform');

module.exports = {
  name: require('./package').name,

  options: {
    babel: {
      plugins: [require.resolve('ember-auto-import/babel-plugin')],
    },
  },

  setupPreprocessorRegistry(type, registry) {
    const plugin = this._buildPlugin();
    plugin.parallelBabel = {
      requireFile: __filename,
      buildUsing: '_buildPlugin',
      params: {},
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
      },
    };
  },
};
