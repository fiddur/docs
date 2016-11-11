import fs from 'fs';
import { basename, dirname } from 'path';
import lsr from 'lsr';
import yaml from 'js-yaml';

/**
 * Recursively scans the specified path for files named index.yml, which represent
 * platforms in Quickstarts.
 * @param {String} path - The path to recursively scan.
 * @returns {Array} An array of entries representing the index files that were found.
 */
export default function getPlatformIndexFiles(path) {
  return lsr.sync(path)
  .filter(file => file.name === 'index.yml')
  .map(file => ({
    name: basename(dirname(file.fullPath)),
    filename: file.fullPath,
    data: yaml.safeLoad(fs.readFileSync(file.fullPath, 'utf8'))
  }));
}
