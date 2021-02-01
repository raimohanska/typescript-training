const path = require('path');

module.exports = {
  mode: 'production',
  devtool: 'inline-source-map',
  devServer: {
    contentBase: ['./src', './dist'],
  },
  entry: './src/index.ts',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: ['babel-loader', 'ts-loader'],
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ],
  },
  optimization: {
    minimize: false,
    usedExports: true
  }
};