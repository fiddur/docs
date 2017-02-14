import { readFileSync } from 'fs';
import { basename, dirname } from 'path';
import lsr from 'lsr';
import yaml from 'js-yaml';

/**
 * Recursively scans the specified path for YAML files with the specified name.
 * @param {String} path - The path to recursively scan.
 * @returns {Array} An array of entries representing the files that were found.
 */
export default function findMetadataFiles(path, filename) {
  return lsr.sync(path)
  .filter(file => file.name === filename)
  .map(file => ({
    name: basename(dirname(file.fullPath)),
    dirname: dirname(file.fullPath),
    filename: file.fullPath,
    data: yaml.safeLoad(readFileSync(file.fullPath, 'utf8'))
  }));
}
