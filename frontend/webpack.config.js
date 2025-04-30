const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin'); // ✨ For CSS extraction
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin'); // ✨ For CSS minification

const isProduction = process.env.NODE_ENV === 'production';

module.exports = {
  entry: './src/script.js', // your entry point
  output: {
    filename: isProduction ? 'script.[contenthash].js' : 'script.js', // ✨ Added [contenthash]
    path: path.resolve(__dirname, 'dist'),
    clean: true // ✨ Automatically clean dist/ before each build
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
    }),
    ...(isProduction
      ? [
          new MiniCssExtractPlugin({
            filename: 'styles.[contenthash].css'
          })
        ]
      : [])
  ],
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [
          isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
          'css-loader'
        ]
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
  mode: isProduction ? 'production' : 'development',
  devtool: isProduction ? 'hidden-source-map' : 'eval-source-map',
  // watch: !isProduction, // Watch files ONLY in development
  devServer: {
    static: './dist',
    open: true,
    liveReload: true,
    hot: false, // for Hot Module Replacement
    client: {
      logging: 'warn'
    }
  },
  optimization: {
    minimizer: [new CssMinimizerPlugin()],
    minimize: isProduction // Minimize only in production
  }
};
