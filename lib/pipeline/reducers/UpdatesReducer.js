import assert from 'assert';
import lsr from 'lsr';
import yaml from 'js-yaml';
import fs from 'fs';
import { resolve, basename } from 'path';
import { parseMarkdown } from '../util';

class UpdatesReducer {

  constructor(options = {}) {
    assert(options.updatesDir, 'UpdatesReducer constructor requires an updatesDir option');
    this.updatesDir = options.updatesDir;
    this.parseMarkdown = options.parseMarkdown || UpdatesReducer.defaults.parseMarkdown;
  }

  reduce(cache) {
    const results = lsr
    .sync(this.updatesDir)
    .map(file => {
      let entry;

      try {
        entry = yaml.safeLoad(fs.readFileSync(file.fullPath, 'utf8'));
      } catch (err) {
        err.message = `While parsing YAML for update ${file.path}: ${err.message}`;
        throw err;
      }

      const date = basename(file.path).replace('.yml', '');

      const format = (updates = []) =>
        updates.map(update => {
          if (update.description) update.description = this.parseMarkdown(update.description);
          return update;
        });

      return {
        date: new Date(date),
        title: date,
        added: format(entry.added),
        fixed: format(entry.fixed),
        changed: format(entry.changed)
      };
    });

    results.sort((a, b) => b.date.valueOf() - a.date.valueOf());

    return results;
  }

}

UpdatesReducer.defaults = {
  parseMarkdown
};

export default UpdatesReducer;
