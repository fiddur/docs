/**
 * Represents a file on disk that can be transformed into a Document.
 */
class File {

  /**
   * Creates a File.
   * @param {String} path - The path to the file, relative to the baseDir.
   * @param {String} filename - The absolute filename of the file.
   * @param {String} text - A string containing the file's content.
   */
  constructor(path, filename, text) {
    this.path = path;
    this.filename = filename;
    this.text = text;
  }

}

export default File;
