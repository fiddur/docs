import _ from 'lodash';

/**
 * Combines a Scanner, Compiler, and Cache to provide a public interface
 * for the document pipeline.
 */
class Pipeline {

  /**
   * Creates a Pipeline.
   * @param {Scanner} scanner - The Scanner instance to use.
   * @param {Compiler} compiler - The Compiler instance to use.
   * @param {Cache} cache - The Cache instance to use.
   */
  constructor(options) {
    this.scanner = options.scanner;
    this.compiler = options.compiler;
    this.cache = options.cache;
  }

  /**
   * Scans the specified paths (relative to the Scanner's base directory)
   * for files, compiles them into Documents, and adds them to the cache.
   * @param {Array} paths - The relative paths to scan.
   */
  load(paths) {
    paths.forEach(dir => {
      const files = this.scanner.scan(dir);
      const docs = _.map(files, file => this.compiler.compile(file));
      this.cache.add(docs);
    });
  }

  /**
   * Returns a loaded document.
   * @param {Object} options - A query object.
   * @param {string} [options.url] - The URL of the document.
   * @param {string} [options.path] - The path of the document, relative to the base docs directory.
   * @param {string} [options.filename] - The absolute filename of the document.
   * @returns {Document} The document, or undefined if no match was found.
   */
  get(options) {
    return this.cache.get(options);
  }

}

export default Pipeline;
