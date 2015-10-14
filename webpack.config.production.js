var webpack = require('webpack');
var path = require('path');
var nconf = require('nconf');

require('./config');

var webpackConfig = {
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  entry: [
    './client/client.js'
  ],
  output: {
    path: path.resolve('./public/js'),
    filename: 'main.min.js'
  },
  module: {
    loaders: [{
      test: /\.(js|jsx)$/,
      exclude: /node_modules/,
      exclude: [
        path.resolve(__dirname, 'node_modules'),
      ],
      loaders: [
        require.resolve('babel-loader')
      ]
    }, {
      test: /\.json$/,
      loader: 'json-loader'
    }]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
        BASE_URL: JSON.stringify(nconf.get('BASE_URL'))
      }
    }),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    })
  ],
  devtool: 'source-map'
};

module.exports = webpackConfig;
