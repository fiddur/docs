import fs from 'fs';
import { relative, resolve } from 'path';
import File from '../../../lib/pipeline/models/File';

const baseDir = resolve(__dirname, '../docs');
export default function getTestFile(path, encoding = 'utf8') {
  const filename = resolve(baseDir, path);
  const shortname = relative(baseDir, filename);
  const text = fs.readFileSync(filename, encoding);
  return new File(filename, shortname, text);
}
