module.exports = {
  root: true,
  extends: ['next/core-web-vitals'],
  rules: {
    '@typescript-eslint/no-unused-vars': 'off',
    '@next/next/no-html-link-for-pages': 'off'
  },
  ignorePatterns: ['**/*']
};