import { resolve } from 'path';
import File from '../../../lib/pipeline/models/File';

export default function getTestFile(path) {
  const baseDir = resolve(__dirname, '../docs');
  return new File(baseDir, path);
}
