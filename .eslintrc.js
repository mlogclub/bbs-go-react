module.exports = {
  extends: ['react-app', 'plugin:prettier/recommended'],
  env: {
    browser: true,
    es6: true,
  },
  rules: {
    'jsx-a11y/anchor-is-valid': 0,
    'react-hooks/exhaustive-deps': 0,
  },
};
