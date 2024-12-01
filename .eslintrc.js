module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  plugins: [
    '@typescript-eslint',
    'prettier',
    'simple-import-sort',
    "unused-imports"
  ],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
    "eslint:recommended",
  ],
  rules: {
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    "@typescript-eslint/no-require-imports": ["error"],
    "import/no-extraneous-dependencies": ["off"],
    "unused-imports/no-unused-imports": "error",
    "unused-imports/no-unused-vars": [
      "error",
      {
        "vars": "all",
        "varsIgnorePattern": "^_",
        "args": "after-used",
        "argsIgnorePattern": "^_"
      }
    ],
    'prettier/prettier': ['error', { endOfLine: 'auto' }],
    'simple-import-sort/imports': 'error',
    'simple-import-sort/exports': 'error',
    'no-multi-spaces': ['error', { ignoreEOLComments: false }],
    'no-trailing-spaces': 'error',
    'spaced-comment': ['error', 'always'],
    'keyword-spacing': ['error', { before: true, after: true }],
    '@typescript-eslint/no-unused-vars': 'off',
    '@typescript-eslint/ban-types': 'off',
    '@typescript-eslint/no-empty-function': 'off',
    "no-undef": "error",
    "no-duplicate-imports": "error",
    "no-restricted-syntax": [
      "error",
      {
        selector: "SequenceExpression",
        message:
          "The comma operator is confusing and a common mistake. Don’t use it!",
      },
    ],
    "no-shadow": ["off"],
    "@typescript-eslint/no-shadow": ["warn"],
    "key-spacing": ["error"],
    "no-multiple-empty-lines": ["error"],
    "@typescript-eslint/no-floating-promises": ["error"],
    "no-return-await": ["off"],
    "@typescript-eslint/return-await": ["error", "in-try-catch"],
    "dot-notation": [
      "off"
    ],
    "no-bitwise": [
      "error"
    ],
    "@typescript-eslint/member-ordering": [
      "off"
    ],
    "@typescript-eslint/dot-notation": [
      "error"
    ],
    "complexity": ["warn", 10],
    "max-lines": ["warn", 200]
  },
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js'],
};
