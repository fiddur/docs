import yaml from 'js-yaml';
import fs from 'fs';
import { resolve } from 'path';

/**
 * Reads the app type manifest from the docs content repository.
 * @returns {Object} A hash of app types, using their names as keys.
 */
export default function getAppTypes() {
  const filename = resolve(__dirname, '../../../docs/config/app-types.yml');
  return yaml.safeLoad(fs.readFileSync(filename, 'utf8')).appTypes;
}
