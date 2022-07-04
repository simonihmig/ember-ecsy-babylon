'use strict';

module.exports = {
  description: '',

  normalizeEntityName() {},

  async afterInstall(/*options*/) {
    const pkg = require('../../package.json');

    await this.addPackagesToProject(
      [
        'ecsy-babylon',
        '@babylonjs/core',
        '@babylonjs/gui',
        '@babylonjs/gui-editor',
        '@babylonjs/inspector',
        '@babylonjs/loaders',
        '@babylonjs/materials',
        '@babylonjs/serializers',
      ].map((name) => ({ name, target: pkg.peerDependencies[name] }))
    );
  },
};
