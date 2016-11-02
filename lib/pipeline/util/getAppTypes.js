import yaml from 'js-yaml';
import fs from 'fs';
import { resolve } from 'path';

export default function getAppTypes() {
  const filename = resolve(__dirname, '../../../docs/config/app-types.yml');
  return yaml.safeLoad(fs.readFileSync(filename, 'utf8')).appTypes;
}
