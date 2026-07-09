const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const RemoveEmptyScriptsPlugin = require('webpack-remove-empty-scripts');
const TerserPlugin = require('terser-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

const SRC_DIR = path.resolve(__dirname, 'src');
const DIST_DIR = path.resolve(__dirname, 'dist');

module.exports = {
  entry: {
    'js/ncf-admin': path.resolve(SRC_DIR, 'js/ncf-admin.js'),
    'css/ncf-admin': path.resolve(SRC_DIR, 'css/ncf-admin.scss'),
  },
  output: {
    path: DIST_DIR,
    filename: '[name].js',
    clean: false,
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
      },
    ],
  },
  plugins: [
    new RemoveEmptyScriptsPlugin(),
    new MiniCssExtractPlugin({
      filename: '[name].css',
    }),
    new CopyPlugin({
      patterns: [
        { from: path.resolve(SRC_DIR, 'nunifuchisaka-custom-fields.php'), to: DIST_DIR },
        { from: path.resolve(__dirname, 'readme.txt'), to: DIST_DIR },
        { from: path.resolve(__dirname, 'LICENSE'), to: DIST_DIR },
        { from: path.resolve(SRC_DIR, 'languages'), to: path.resolve(DIST_DIR, 'languages'), noErrorOnMissing: true },
      ],
    }),
  ],
  optimization: {
    minimizer: [
      new TerserPlugin({ extractComments: false }),
      new CssMinimizerPlugin(),
    ],
  },
};

