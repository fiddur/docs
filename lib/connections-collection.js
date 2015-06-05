var nconf = require('nconf');
var articlesCollection = require('./articles-collection').articles;
var _ = require('lodash');

var connections = [];

var connectionDocs = _.find(articlesCollection.items, { hash: 'connections' });
for (var i = 0; i < connectionDocs.items.length; i++) {
  var connectionType = connectionDocs.items[i];
  for (var c = 0; c < connectionType.items.length; c++) {
    var connection = connectionType.items[c];
    if (connection.connection) {
      connections.push({
        title: connection.connection,
        hash: connection.hash,
        url: connection.url,
        image: connection.image,
        type: connectionType.hash,
        alias: connection.alias
      });
    }
  }
}

module.exports = connections;
