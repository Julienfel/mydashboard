const webpack = require('webpack');
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const BUILD_DIR = path.resolve(__dirname, 'dist');
const APP_DIR = path.resolve(__dirname, 'src');

const config = {
  entry: [
    'babel-polyfill',
    'react-hot-loader/patch',
    'whatwg-fetch',
    `${APP_DIR}/js/index.jsx`,
  ],
  output: {
    path: BUILD_DIR,
    filename: 'bundle.js',
    publicPath: '/',
  },
  module: {
    rules: [
      {
        test: /.jsx?$/,
        exclude: '/node_modules/',
        use: {
          loader: 'babel-loader',
        },
      }, {
        test: /\.css$/,
        exclude: '/node_modules/',
        include: path.resolve(__dirname, 'src/css'),
        use: [
          { loader: 'style-loader' },
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
              sourceMap: true,
            },
          },
          { loader: 'postcss-loader' },
        ],
      }, {
        test: /\.css$/,
        exclude: '/node_modules/',
        include: path.resolve(__dirname, 'src/js'),
        use: [
          { loader: 'style-loader' },
          {
            loader: 'css-loader',
            options: {
              modules: true,
              importLoaders: 1,
              sourceMap: true,
              localIdentName: '[name]_[local]_[hash:base64:5]',
            },
          },
          { loader: 'postcss-loader' },
        ],
      }, {
        test: /\.(png|jpe?g|gif|svg|eot|ttf|woff|woff2)$/,
        exclude: '/node_modules/',
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10000,
            },
          },
        ],
      }, {
        test: /\.(wav|mp3|mp4|pdf|json)$/,
        exclude: '/node_modules/',
        use: {
          loader: 'file-loader',
        },
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  devtool: 'inline-source-map',
  plugins: [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.NamedModulesPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new ExtractTextPlugin('styles.css'),
    new HtmlWebpackPlugin({
      title: 'Dashboard',
      description: 'Exercice',
      filename: `${BUILD_DIR}/index.html`,
      template: `${APP_DIR}/index.html`,
    }),
  ],
};

module.exports = config;
