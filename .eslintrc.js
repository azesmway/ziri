module.exports = {
  root: true,
  extends: ['@react-native-community'],
  plugins: ['react', 'prettier'],
  rules: {
    eqeqeq: 'off',
    'prettier/prettier': 'error',
    'comma-dangle': ['error', 'never'],
    semi: [2, 'never'],
    'max-len': ['error', { code: 140 }]
  }
}
