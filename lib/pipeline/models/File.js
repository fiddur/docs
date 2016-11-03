/**
 * Represents a file on disk that can be transformed into a Document.
 */
class File {

  /**
   * Creates a File.
   * @param {String} filename - The absolute filename of the file.
   * @param {String} shortname - The filename of the file, relative to the base directory.
   * @param {String} text - A string containing the file's content.
   */
  constructor(filename, shortname, text) {
    this.filename = filename;
    this.shortname = shortname;
    this.text = text;
  }

}

export default File;
