import nconf from 'nconf';
import _ from 'lodash';

var stores = _(Object.keys(nconf.stores)).reverse().map(function (store) {
  return nconf.stores[store].store;
}).value();

export default _.extend.apply(_, [{}].concat(stores));
