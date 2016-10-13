import fs from 'fs';
import { resolve } from 'path';

/**
 * Represents a file (usually on disk) that can be transformed into a Document.
 */
class File {

  /**
   * Creates a File.
   * @param {String} baseDir - The base directory from which all paths are relative.
   * @param {String} path - The path to the file, relative to the baseDir.
   * @param {String} [encoding] - The file's encoding, or UTF8 if not specified.
   */
  constructor(baseDir, path, encoding = 'utf8') {
    this.path = path;
    this.filename = resolve(baseDir, this.path);
    this.text = fs.readFileSync(this.filename, encoding);
  }

}

export default File;
