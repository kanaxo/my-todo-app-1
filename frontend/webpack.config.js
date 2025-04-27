const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: './src/script.js', // your entry point
  output: {
    filename: 'script.js',
    path: path.resolve(__dirname, 'dist')
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html'
    }),
    new CopyPlugin({
      patterns: [
        { from: 'src/images', to: 'images' },
        { from: 'src/audio', to: 'audio' }
        // { from: 'src/styles.css', to: 'styles.css' }
      ]
    })
  ],
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource'
      },
      {
        test: /\.(mp3|wav|ogg)$/i,
        type: 'asset/resource'
      }
    ]
  },
  mode: 'development', // or 'production'
  devtool: 'eval-source-map',
  watch: true, // Enable watch mode
  devServer: {
    static: './dist',
    open: true,
    liveReload: true,
    hot: false, // for Hot Module Replacement
    client: {
      logging: 'warn'
    }
  }
};
