import { docsByUrl } from '../docs';
import path from 'path';
import logger from 'winston';

export default {
    // Name is the resource. Required.
    name: 'article',
    // At least one of the CRUD methods is Required
    read: function(req, resource, params, config, callback) {
      var options = {};
      // Object.keys(res.locals).forEach(function(key) {
      //   options[key] = res.locals[key];
      // });
      let doc = docsByUrl[params.url];
      if (doc) {
        let content = doc.getSections().content;
        if (content) {
          let html = content(options);
          return callback(null, { html: html });
        }
      }
      return callback('Document not found.');
    },
    // other methods
    // create: function(req, resource, params, body, config, callback) {},
    // update: function(req, resource, params, body, config, callback) {},
    // delete: function(req, resource, params, config, callback) {}
}
