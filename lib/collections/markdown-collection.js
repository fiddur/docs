/**
 * Module dependencies.
 */

import memdocs from '../docs/memdocs';
import { basename } from 'path';
import d from 'debug';
import _ from 'lodash';
import Doc from '../docs/doc';

var debug = d('docs:collection');

export default function(collectionPath, buildObject) {
  var documents = {
    items: []
  };

  documents.findByHash = function(hash) {
    var parts = hash.split('/');
    var current = documents;
    for (var i = 0; i < parts.length; i++) {
      current = _.find(current.items, { hash: parts[i] });
    }
    return current;
  };

  memdocs.map(file => {
    if (file.filename.indexOf(collectionPath) !== 0) return;

    // skip non-markdown files
    if (!/\.md$/.test(file.filename)) return;

    // skip partials
    if (file.filename.indexOf('_includes') > -1 || basename(file.filename).indexOf('_') === 0) {
      return;
    }

    var filepath = file.filename.replace(collectionPath, '');
    var parts = filepath.replace('.md', '').split('/');

    var current = documents;
    var currentParts = [];
    for (var i = 0; i < parts.length - 1; i++) {
      var next = _.find(current.items, { hash: parts[i] });
      currentParts[i] = parts[i];
      if (!next) {
        next = {
          hash: parts[i],
          items: []
        };

        current.items.push(next);
      }
      current = next;
    }

    var doc = new Doc(filepath, file.text);

    debug('adding %s to collection', doc.getUrl());

    var obj = buildObject(doc);

    obj.hash = obj.hash || parts[parts.length-1];
    if (obj.hash === 'index') {
      delete obj.hash;
      _.merge(current, obj);
    } else {
      current.items = current.items || [];
      current.items.push(obj);
    }
  });

  return documents;
}
