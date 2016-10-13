import fs from 'fs';
import { resolve } from 'path';

/**
 * Represents a file (usually on disk) that can be transformed into a Document.
 */
class File {

  /**
   * Loads the contents of a file from disk and creates a File to represent it.
   * @param {String} baseDir - The base directory from which all paths are relative.
   * @param {String} path - The path to the file, relative to the baseDir.
   * @param {String} [encoding] - The file's encoding, or UTF8 if not specified.
   */
  static load(baseDir, path, encoding = 'utf8') {
    const text = fs.readFileSync(resolve(baseDir, path), encoding);
    return new File(baseDir, path, text);
  }

  /**
   * Creates a File.
   * @param {String} baseDir - The base directory from which all paths are relative.
   * @param {String} path - The path to the file, relative to the baseDir.
   * @param {String} text - A string containing the file's content.
   */
  constructor(baseDir, path, text) {
    this.path = path;
    this.filename = resolve(baseDir, this.path);
    this.text = text;
  }

}

export default File;
