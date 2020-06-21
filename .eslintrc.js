module.exports = {
  extends: [
    'eslint-config-alloy',
    'eslint-config-alloy/typescript',
  ],
  globals: {},
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  rules: {
    indent: [
      'error',
      2,
    ],
    '@typescript-eslint/indent': 'off',
    '@typescript-eslint/explicit-member-accessibility': 'off',
    '@typescript-eslint/no-var-requires': 'off',
    '@typescript-eslint/consistent-type-assertions': 'off',
    '@typescript-eslint/typedef': 'off',
    'comma-dangle': ['error', 'always-multiline'],
    '@typescript-eslint/no-empty-interface': 'off',
    'max-params': 'off',
    'eol-last': 2,
    'semi': ['error', 'always'],
    quotes: [2, 'single'],
    'complexity': 'off',
  },
};
