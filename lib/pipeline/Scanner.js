import fs from 'fs';
import { resolve } from 'path';
import lsr from 'lsr';
import nconf from 'nconf';
import File from './models/File';

/**
 * Searches the filesystem for article files.
 */
class Scanner {

  /**
   * Creates a Scanner.
   * @param {Object} options - An options hash.
   * @param {string} options.baseDir - The base (root) directory for articles.
   * @param {RegExp} [options.regex] - The regex to use to match files.
   */
  constructor(options) {
    if (!options.baseDir) {
      throw new Error('Scanner constructor requires a baseDir option');
    }
    this.baseDir = options.baseDir;
    this.regex = options.regex || /\.(md|html)$/;
  }

  /**
   * Recursively scans the specified path for matching files.
   * @param {string} dir - The path to scan, relative to the baseDir.
   * @returns {Array} An array of Files that were found.
   */
  scan(dir) {
    const fullPath = resolve(this.baseDir, dir);

    const docs = [];
    lsr.sync(fullPath).forEach(stat => {
      if (this.regex.test(stat.path)) {
        const filename = resolve(fullPath, stat.path);
        const path = filename.replace(this.baseDir, '');
        const text = fs.readFileSync(filename, 'utf8');
        docs.push(new File(filename, path, text));
      }
    });

    return docs;
  }

}

export default Scanner;
