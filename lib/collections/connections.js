import { items } from './articles';
import { find } from 'lodash';

const connectionDocs = find(items, { hash: 'connections' });
const connections = [];

connectionDocs.items.forEach(connectionType =>
  connectionType.items
    .filter(isConnection)
    .forEach(connection => addConnection(connection, connectionType))
);

/**
 * Check if is a valid connection
 */
function isConnection(connection) {
  return connection.connection;
}

/**
 * Add connection object to `connections`
 */
function addConnection(connection, connectionType) {
  const obj = {
    title: connection.connection,
    hash: connection.hash,
    url: connection.url,
    image: connection.image,
    type: connectionType.hash,
    alias: connection.alias
  };

  // Add specific seo_alias for seo of auto generated pages eg: https://auth0.com/authenticate/
  if (connection.seo_alias) {
    obj.seo_alias = connection.seo_alias;
  }

  connections.push(obj);
}

export default connections;
