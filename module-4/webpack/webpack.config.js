const path = require('path');

module.exports = {
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
        use: [ 
          { 
            loader: 'babel-loader',
            options: {
              "presets": [
                [
                  "@babel/preset-env",
                  {
                    "targets": "> 0.2% in FI",
                    useBuiltIns: 'usage',
                    corejs: "3.8",
                    debug: true
                  }
                ]
              ]
            }
          }, 
          'ts-loader'
        ],
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ],
  },
};
