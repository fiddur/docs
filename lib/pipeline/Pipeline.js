import _ from 'lodash';
import d from 'debug';

const debug = d('docs:pipeline');
const isMetadataPlugin = plugin => typeof plugin.getMetadata === 'function';
const isContentPlugin = plugin => typeof plugin.transform === 'function';

/**
 * Combines a Scanner, Compiler, Cache, and Renderer to provide a public interface
 * for the document pipeline.
 */
class Pipeline {

  /**
   * Creates a Pipeline.
   * @param {Object} options - An options hash.
   * @param {Cache} options.cache - The Cache instance to use.
   * @param {Compiler} options.compiler - The Compiler instance to use.
   * @param {Renderer} options.renderer - The Renderer instance to use.
   * @param {Scanner} options.scanner - The Scanner instance to use.
   */
  constructor(options) {
    this.cache = options.cache;
    this.compiler = options.compiler;
    this.renderer = options.renderer;
    this.scanner = options.scanner;
    this.plugins = [];
    this.scanner.on('add', this.handleFileAdded.bind(this));
    this.scanner.on('change', this.handleFileChanged.bind(this));
    process.on('exit', this.stop.bind(this));
  }

  /**
   * Adds a plugin to the pipeline.
   * @param {Object} plugin - The plugin to add.
   */
  use(plugin) {
    if (!isMetadataPlugin(plugin) && !isContentPlugin(plugin)) {
      throw new Error('Pipeline.use() was called with an invalid plugin');
    }
    this.plugins.push(plugin);
  }

  /**
   * Scans the specified paths (relative to the Scanner's base directory)
   * for files, compiles them into Documents, and adds them to the cache.
   * @param {Array|...string} paths - The relative path(s) to scan.
   */
  watch(...args) {
    const paths = _.isArray(args[0]) ? args[0] : args;
    this.scanner.add(paths);
  }

  handleFileAdded(file) {
    debug(`file added: ${file.filename}`);
    this.process(file);
  }

  handleFileChanged(file) {
    debug(`file changed: ${file.filename}`);
    this.process(file);
  }

  process(file) {
    const metadataPlugins = this.plugins.filter(isMetadataPlugin);
    const contentPlugins = this.plugins.filter(isContentPlugin);
    const doc = this.compiler.compile(
      file,
      metadataPlugins,
      contentPlugins
    );
    this.cache.add(doc);
  }

  /**
   * Render all of the loaded documents.
   * @param {Object} environment - A hash of static variables to use in rendering.
   */
  init(environment) {
    this.cache.forEach(doc => doc.render(this, environment));
  }

  stop() {
    this.scanner.stop();
  }

  /**
   * Return the document in the cache with the specified URL.
   * @param {string} url - The URL to match.
   * @returns {Document} The document, or undefined if no match was found.
   */
  getByUrl(url) {
    return this.cache.getByUrl(url);
  }

  /**
   * Return the document in the cache with the specified filename.
   * @param {string} filename - The filename to match.
   * @returns {Document} The document, or undefined if no match was found.
   */
  getByFilename(filename) {
    return this.cache.getByFilename(filename);
  }

  /**
   * Given a fragment of metadata, return the first document in the cache which matches.
   * @param {Function} predicate - A predicate function.
   * @returns {Document} The document, or undefined if no match was found.
   */
  find(predicate) {
    return this.cache.find(predicate);
  }

  /**
   * Given a predicate function, return all documents in the cache which match.
   * @param {Function} predicate - A predicate function.
   * @returns {Array} An array of Documents that matched the query.
   */
  filter(predicate) {
    return this.cache.filter(predicate);
  }

  /**
   * Executes the specified function for each document in the cache.
   * @param {Function} The function to execute.
   */
  forEach(func) {
    this.cache.forEach(func);
  }

  /**
   * Call the specified function once for each document in the cache and collect the results.
   * @param {Function} func - The function to call.
   * @returns {Array} An array of values returned from the function calls.
   */
  map(func) {
    return this.cache.map(func);
  }

  /**
   * Call the specified function or Reducer once for each document in the cache and return
   * the generated result.
   * @param {function|Reducer} reducer - The function or Reducer to call.
   * @returns {any} The result of the reduction.
   */
  reduce(reducer) {
    return this.cache.reduce(reducer);
  }

}

export default Pipeline;
