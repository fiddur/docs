import fs from 'fs';
import { resolve } from 'path';
import File from '../../../lib/pipeline/models/File';

export default function getTestFile(path, encoding = 'utf8') {
  const filename = resolve(__dirname, '../docs', path);
  const text = fs.readFileSync(filename, encoding);
  return new File(path, filename, text);
}
