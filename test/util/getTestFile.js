import fs from 'fs';
import { relative, resolve } from 'path';
import File from '../../lib/pipeline/models/File';

const baseDir = resolve(__dirname, '../docs');

/**
 * Creates a File from one of the article stored in the test/docs
 * path, for the purposes of testing.
 * @param {String} path - The path to the article on disk, relative to test/docs.
 * @param {String} [encoding] - The encoding to use to read the file; otherwise UTF8.
 * @returns {File} The loaded File.
 */
export default function getTestFile(path, encoding = 'utf8') {
  const filename = resolve(baseDir, path);
  const shortname = relative(baseDir, filename);
  const text = fs.readFileSync(filename, encoding);
  return new File(filename, shortname, text);
}
