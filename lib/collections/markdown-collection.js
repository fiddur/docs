/**
 * Module dependencies.
 */

import lsr from 'lsr';
import fs from 'fs';
import { resolve, basename } from 'path';
import d from 'debug';
import _ from 'lodash';
import Doc from '../docs/doc';

var debug = d('docs:collection');

export default function(docspath, buildObject) {
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

  /**
   * List all /docs documents urls in sitemap
   * discarding the ones already in sitemap list
   */

  var buildTree = function(current, path) {
    var paths = fs.readdirSync(path);
    for (var i = 0; i < paths.length; i++) {
      var resolvedPath = resolve(path, paths[i]);
      var stats = fs.statSync(resolvedPath);
      if (stats.isDirectory()) {
        var item = {
          hash: paths[i],
          items: []
        };
        current.items.push(item);
        buildTree(item, resolvedPath);
      }
    }
  };
  buildTree(documents, docspath);

  lsr
  .sync(docspath)
  .forEach(function(fileStat) {
    var filepath = fileStat.path;

    var parts = filepath.substring(2).replace('.md', '').split('/');

    var current = documents;
    for (var i = 0; i < parts.length - 1; i++) {
      var next = _.find(current.items, { hash: parts[i] });
      if (!next) {
        next = {
          hash: parts[i],
          url: parts.join('/'),
          items: []
        };

        current.items.push(next);
      }
      current = next;
    }

    // skip non-markdown files
    if (!/\.md$/.test(filepath)) return;

    // skip partials
    if (filepath.indexOf('_includes') > -1 || basename(filepath).indexOf('_') === 0) {
      return;
    }

    var doc = new Doc(docspath, filepath);

    debug('adding %s to collection', doc.getUrl());

    var obj = buildObject(doc);

    obj.hash = obj.hash || parts[parts.length-1];
    if (obj.hash === 'index') {
      delete obj.hash;
      _.merge(current, obj);
    } else {
      current.items.push(obj);
    }

  });

  return documents;
}
