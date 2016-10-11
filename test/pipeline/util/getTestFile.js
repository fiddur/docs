import fs from 'fs';
import { resolve } from 'path';
import File from '../../../lib/pipeline/models/File';

export default function getTestFile(path) {
  const filename = resolve(__dirname, '..', path);
  return new File(filename, path, fs.readFileSync(filename, 'utf8'));
}
