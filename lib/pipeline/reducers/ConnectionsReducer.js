import Reducer from '../models/Reducer';

class ConnectionsReducer extends Reducer {

  filter(doc) {
    return (
      // Only consider documents within the /connections/ path.
      doc.path.indexOf('/connections/') === 0 &&
      // Only consider documents with a "connection" property.
      doc.connection
    );
  }

}

export default ConnectionsReducer;
