'use strict';

module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
    ecmaFeatures: {
      legacyDecorators: true
    }
  },
  plugins: [
    'ember',
    '@typescript-eslint'
  ],
  extends: [
    'eslint:recommended',
    'plugin:ember/recommended'
  ],
  env: {
    browser: true
  },
  rules: {
    'no-restricted-imports': ['error',
      {
        name: '@babylonjs/core',
        message: 'Don\'t import from @babylonjs/core, use a direct import instead! See https://doc.babylonjs.com/features/es6_support#tree-shaking'
      },
      {
        name: 'ecsy-babylon',
        message:
          "Don't import from index modules of ecsy-babylon, use a direct import instead to support tree shaking! See https://github.com/ef4/ember-auto-import/issues/121",
      },
      {
        name: 'ecsy-babylon/systems',
        message:
          "Don't import from index modules of ecsy-babylon, use a direct import instead to support tree shaking! See https://github.com/ef4/ember-auto-import/issues/121",
      },
    ]
  },
  overrides: [
    // ts files
    {
      files: ['**/*.ts'],
      extends: [
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:@typescript-eslint/recommended',
      ],
      rules: {
        '@typescript-eslint/ban-ts-ignore': 'warn',
        '@typescript-eslint/no-explicit-any': 'warn',
        '@typescript-eslint/no-empty-function': 'warn'
      }
    },
    // node files
    {
      files: [
        '.eslintrc.js',
        '.template-lintrc.js',
        'ember-cli-build.js',
        'index.js',
        'testem.js',
        'blueprints/*/index.js',
        'config/**/*.js',
        'tests/dummy/config/**/*.js',
        'lib/*.js'
      ],
      excludedFiles: [
        'addon/**',
        'addon-test-support/**',
        'app/**',
        'tests/dummy/app/**'
      ],
      parserOptions: {
        sourceType: 'script'
      },
      env: {
        browser: false,
        node: true
      },
      plugins: ['node'],
      extends: ['plugin:node/recommended']
    }
  ]
};
