module.exports = {
  root: true,
  extends: 'standard',
  parserOptions: {
    sourceType: 'script'
  },
  env: {
    browser: false,
    es6: true,
    node: true
  },
  rules: {
    'object-curly-spacing': [ 2, 'always' ],
    strict: [2, 'global'],
    quotes: [2, 'single', 'avoid-escape'],
    semi: [2, 'always'],
    'space-before-function-paren': [1, 'never'],
    'space-infix-ops': 2,
    'spaced-comment': [2, 'always'],
    'arrow-spacing': 2,
    'no-console': 0,
    'no-var': 2,
    'no-undef': 1,
    'no-unused-vars': [1, { "vars": "all", "args": "after-used" }],
    'padded-blocks': 0
  }
};
