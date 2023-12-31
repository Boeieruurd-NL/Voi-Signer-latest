var path = require('path');
const webpack = require('webpack');

function srcPath(subdir) {
  return path.join(__dirname, './', subdir);
}

module.exports = {
  // Change to your "entry-point".
  mode: 'production',
  devtool: 'source-map', //remove this when done debugging.
  optimization: {
    // We no not want to minimize our code.
    minimize: false,
  },
  entry: {
    background: './src/background/index.ts',
    content: './src/content/content.ts',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
  },
  plugins: [
    // Generate a base html file and injects all generated css and js files
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
    }),
  ],
  resolve: {
    alias: {
      '@voisigner/common': srcPath('../common/src'),
      '@voisigner/crypto': srcPath('../crypto'),
      '@voisigner/storage': srcPath('../storage'),
      '@voisigner/ui': srcPath('../ui'),
    },
    extensions: ['.ts', '.tsx', '.js', '.json'],
    fallback: {
      buffer: require.resolve('buffer'),
      crypto: false,
    },
  },
  module: {
    rules: [
      {
        test: /\.(ts|js)x?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'ts-loader',
            options: {},
          },
        ],
      },
    ],
  },
};
