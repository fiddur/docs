/**
 * Represents a file (usually on disk) that can be transformed into a Document.
 */
class File {

  /**
   * Creates a File.
   * @param {String} filename - The absolute filename for the file.
   * @param {String} path - The path to the file relative to the base articles directory.
   * @param {String} text - The contents of the file.
   */
  constructor(filename, path, text) {
    this.filename = filename;
    this.path = path;
    this.text = text;
  }

}

export default File;
