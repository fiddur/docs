/**
 * Module dependencies.
 */

import { resolve, basename } from 'path';
import nconf from 'nconf';
import lsr from 'lsr';
import fs from 'fs';
import yaml from 'js-yaml';
import { compileTemplate } from '../docs/compiler';

var updatesPath = nconf.get('CONTENT_UPDATES_PATH') || resolve(__dirname, '../../docs/updates');

var contentUpdates = [];

var processUpdates = function(updates) {
  var safeUpdates = updates || [];
  safeUpdates.map((update) => {
    if (update.description) {
      update.description = compileTemplate(update.description)({});
    }
  });
  return safeUpdates;
};

lsr
.sync(updatesPath)
.forEach(function(fileStat) {
  var filepath = fileStat.path;

  var fileDate = basename(filepath).replace('.yml', '');
  var updates = yaml.safeLoad(fs.readFileSync(resolve(updatesPath, filepath)));

  updates.date = new Date(fileDate);
  updates.title = fileDate;
  updates.added = processUpdates(updates.added);
  updates.fixed = processUpdates(updates.fixed);
  updates.changed = processUpdates(updates.changed);

  contentUpdates.push(updates);
});

// Sort decending
contentUpdates.reverse();


export default contentUpdates;
