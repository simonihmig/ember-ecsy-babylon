'use strict';

module.exports = {
  description: '',

  normalizeEntityName() {
  },

  async afterInstall(/*options*/) {
    // Ensure ecsy-babylon is a direct dependency, so ember-auto-import works
    await this.addPackagesToProject([
      { name: 'ecsy-babylon', target: this.ownEcsyBabylonVersion }
    ]);
  },

  get ownEcsyBabylonVersion() {
    const pkg = require('../../package.json');
    const version = pkg.dependencies['ecsy-babylon'];
    return version;
  }
};
