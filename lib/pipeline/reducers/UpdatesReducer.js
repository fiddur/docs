import assert from 'assert';
import lsr from 'lsr';
import yaml from 'js-yaml';
import fs from 'fs';
import { resolve, basename } from 'path';
import { parseMarkdown } from '../util';

/**
 * Reduces a Cache into an array of updates representing a changelog.
 * (NB: Strangely, this doesn't currently use the Cache itself, but it has to be a reduction
 * to ensure it is updated based on changes to the filesystem.)
 */
class UpdatesReducer {

  /**
   * Creates an instance of UpdatesReducer.
   * @param {Object} options - An options hash.
   * @param {String} options.updateDir - The base directory to scan for update files.
   * @param {Function} [options.load] - A function that parses the raw update data.
   * @param {Function} [options.parseMarkdown] - A function that can render Markdown content.
   */
  constructor(options = {}) {
    assert(options.updatesDir, 'UpdatesReducer constructor requires an updatesDir option');
    this.updatesDir = options.updatesDir;
    this.load = options.load || UpdatesReducer.defaults.load;
    this.parseMarkdown = options.parseMarkdown || UpdatesReducer.defaults.parseMarkdown;
  }

  /**
   * Recursively scans the filesystem for all update files within the updates directory, reads
   * metadata from the files, renders any "description" properties as Markdown, and returns
   * an array of the updates in reverse-chronological order.
   * @param {Cache} cache - The Cache to reduce.
   * @returns {Tree} An array of updates.
   */
  reduce(cache) {
    const results = lsr
    .sync(this.updatesDir)
    .map(file => {
      let entry;

      try {
        entry = this.load(fs.readFileSync(file.fullPath, 'utf8'));
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
  load: yaml.safeLoad,
  parseMarkdown
};

export default UpdatesReducer;
