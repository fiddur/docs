import fs from 'fs';
import { basename, dirname } from 'path';
import lsr from 'lsr';
import yaml from 'js-yaml';

export default function getPlatformIndexFiles(path) {
  return lsr.sync(path)
  .filter(file => file.name === 'index.yml')
  .map(file => ({
    name: basename(dirname(file.fullPath)),
    filename: file.fullPath,
    data: yaml.safeLoad(fs.readFileSync(file.fullPath, 'utf8'))
  }));
}
