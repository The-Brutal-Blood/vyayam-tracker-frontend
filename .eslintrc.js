module.exports = {
  root: true,
  extends: '@react-native',
  plugins: ['import', 'unused-imports'],
  rules: {
    // Unused imports are removed automatically with --fix;
    // unused variables are still reported (prefix with _ to allow intentionally unused).
    'unused-imports/no-unused-imports': 'error',
    'unused-imports/no-unused-vars': [
      'warn',
      {
        vars: 'all',
        varsIgnorePattern: '^_',
        args: 'after-used',
        argsIgnorePattern: '^_',
      },
    ],
    // Handled by unused-imports above — keep only one source of truth.
    '@typescript-eslint/no-unused-vars': 'off',

    // Consistent import ordering: react/react-native first, external packages,
    // then @/ internal modules, then relative imports — alphabetized within groups.
    'import/order': [
      'error',
      {
        groups: [['builtin', 'external'], 'internal', ['parent', 'sibling', 'index']],
        pathGroups: [
          { pattern: 'react', group: 'external', position: 'before' },
          { pattern: 'react-native', group: 'external', position: 'before' },
          { pattern: '@/**', group: 'internal' },
        ],
        pathGroupsExcludedImportTypes: ['react', 'react-native'],
        distinctGroup: false,
        'newlines-between': 'always',
        alphabetize: { order: 'asc', caseInsensitive: true },
      },
    ],
    'import/no-duplicates': 'error',
    'import/newline-after-import': 'error',
    'import/first': 'error',
  },
};
