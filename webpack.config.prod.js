const webpack = require('webpack');
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const BUILD_DIR = path.resolve(__dirname, 'dist');
const APP_DIR = path.resolve(__dirname, 'src');

const config = {
  entry: [
    'whatwg-fetch',
    `${APP_DIR}/js/index.jsx`,
  ],
  output: {
    path: BUILD_DIR,
    filename: 'js/bundle.js',
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
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: {
                importLoaders: 1,
              },
            },
            'postcss-loader',
          ],
        }),
      }, {
        test: /\.css$/,
        exclude: '/node_modules/',
        include: path.resolve(__dirname, 'src/js'),
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: {
                modules: true,
                importLoaders: 1,
                localIdentName: '[name]_[local]_[hash:base64:5]',
              },
            },
            'postcss-loader',
          ],
        }),
      }, {
        test: /\.(png|jpe?g|gif|svg|eot|ttf|woff|woff2)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'url-loader',
            options: {
              context: 'src',
              name: '[path][name].[ext]?[hash]',
              limit: 10000,
            },
          }, {
            loader: 'image-webpack-loader',
            options: {
              mozjpeg: { progressive: true },
              gifsicle: { interlaced: false },
              optipng: { optimizationLevel: 4 },
              pngquant: { quality: '75-90', speed: 3 },
            },
          },
        ],
      }, {
        test: /\.(wav|mp3|mp4|pdf|json)$/,
        exclude: /node_modules/,
        use: {
          loader: 'file-loader',
          options: {
            context: 'src',
            name: '[path][name].[ext]?[hash]',
          },
        },
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  plugins: [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false,
    }),
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: false,
      comments: false,
    }),
    new ExtractTextPlugin('css/styles.css'),
    new HtmlWebpackPlugin({
      title: 'Dashboard',
      description: 'Exercice',
      filename: `${BUILD_DIR}/index.html`,
      template: `${APP_DIR}/index.html`,
    }),
  ],
};

module.exports = config;
