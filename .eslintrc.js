module.exports = {
  root: true,
  extends: '@react-native',
  rules: {
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': ['off'],
    'react/self-closing-comp': [
      'off',
      {
        component: true,
        html: true,
      },
    ],
    'prettier/prettier': 'off',
    quotes: 'off',
    semi: 'off',
    'no-trailing-spaces': 'off',
    'eol-last': 'off',
  },
};
