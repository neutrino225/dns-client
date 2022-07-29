module.exports = {
    parser: '@typescript-eslint/parser',
    parserOptions: {
      project: './tsconfig.json',
      sourceType: 'module',
      files: ['*.ts', '*.tsx'],
      
    },
    plugins: ['@typescript-eslint/eslint-plugin'],
    extends: [
      'plugin:@typescript-eslint/recommended',
      'plugin:prettier/recommended',
    ],
    // overrides: [{
    // }],
    root: true,
    env: {
      node: true,
      jest: true,
    },
    ignorePatterns: ['.eslintrc.js'],
    rules: {
      '@typescript-eslint/interface-name-prefix': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      "no-await-in-loop": 'error',
      '@typescript-eslint/no-unused-vars': ['warn', { ignoreRestSiblings: true }]
    },
  };