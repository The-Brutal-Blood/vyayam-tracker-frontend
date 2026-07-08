module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    // Zod v4 ships `export * as ns from` syntax, which the RN preset
    // does not transform on its own.
    '@babel/plugin-transform-export-namespace-from',
    [
      'module-resolver',
      {
        root: ['.'],
        extensions: [
          '.ios.ts',
          '.android.ts',
          '.ts',
          '.ios.tsx',
          '.android.tsx',
          '.tsx',
          '.js',
          '.jsx',
          '.json',
        ],
        alias: {
          '@': './src',
        },
      },
    ],
  ],
};
