var nconf = require('nconf');
var _ = require('lodash');

var stores = _(Object.keys(nconf.stores)).reverse().map(function (store) {
  return nconf.stores[store].store;
}).value();

module.exports = _.extend.apply(_, [{}].concat(stores));