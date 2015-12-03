var webpack = require('webpack');
var path = require('path');
var Clean = require('clean-webpack-plugin');

require('./config');

var webpackConfig = {
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  entry: {
    client: './client/client.js',
    base: './client/base.js',
    standard: './client/standard.js',
    browser: './client/browser.js'
  },
  output: {
    path: path.resolve('./public/js'),
    filename: '[name].[chunkhash].bundle.js',
    chunkFilename: '[id].[chunkhash].chunk.js'
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
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'commons',
      filename: 'commons.[chunkhash].bundle.js',
      minChunks: 2
    }),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin({
      minimize: true,
      compress: {
        warnings: false
      },
      sourceMap: true
    }),
    function() {
      this.plugin('done', function(stats) {
        require('fs').writeFileSync(
          path.join(__dirname, './public/js/assets.json'),
          JSON.stringify(stats.toJson().assetsByChunkName));
      });
    }
  ],
  devtool: 'source-map'
};

module.exports = webpackConfig;
