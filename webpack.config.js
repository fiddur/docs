var webpack = require('webpack');
var path = require('path');
var Clean = require('clean-webpack-plugin');

require('./config');

var webpackConfig = {
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  entry: {
    client: [
      'webpack-dev-server/client?http://localhost:3000',
      'webpack/hot/only-dev-server',
      './client/client.js',
    ],
    base: [
      'webpack-dev-server/client?http://localhost:3000',
      'webpack/hot/only-dev-server',
      './client/base.js',
    ],
    standard: [
      'webpack-dev-server/client?http://localhost:3000',
      'webpack/hot/only-dev-server',
      './client/standard.js'
    ],
    browser: [
      'webpack-dev-server/client?http://localhost:3000',
      'webpack/hot/only-dev-server',
      './client/browser.js'
    ]
  },
  output: {
    path: path.resolve('./public/js'),
    publicPath: '/docs/js/',
    filename: '[name].bundle.js',
    chunkFilename: '[id].chunk.js'
  },
  module: {
    loaders: [{
      test: /\.(js|jsx)$/,
      exclude: [
        path.resolve(__dirname, 'node_modules'),
      ],
      loaders: [
        require.resolve('react-hot-loader'),
        require.resolve('babel-loader')
      ]
    }, {
      test: /\.json$/,
      loader: 'json-loader'
    }, {
      test: /\.styl$/,
      loader: 'style-loader!css-loader!autoprefixer-loader!stylus-loader'
    }, {
      test: /\.(png|woff|woff2|eot|ttf|svg)$/,
      loader: 'url-loader?limit=100000'
    }]
  },
  plugins: [
    new Clean(['/docs/js/']),
    new webpack.ProvidePlugin({
      Promise: 'imports?this=>global!exports?global.Promise!es6-promise',
      fetch: 'imports?this=>global!exports?global.fetch!whatwg-fetch',
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'commons',
      filename: 'commons.bundle.js',
      minChunks: 2
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV)
      }
    })
  ],
  devtool: 'source-map'
};

module.exports = webpackConfig;
