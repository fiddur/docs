import assert from 'assert';
import fs from 'fs';
import EventEmitter from 'events';
import { basename, extname, relative, resolve } from 'path';
import chokidar from 'chokidar';
import { flatten } from 'lodash';
import File from './models/File';

/**
 * Scans the filesystem for articles and monitors them, emitting events
 * when they are changed.
 */
class Watcher extends EventEmitter {

  /**
   * Creates a Watcher.
   * @param {Object} options - An options hash.
   * @param {string} options.baseDir - The base (root) directory for articles.
   * @param {Array<string>} [options.extensions] - File extensions to include.
   */
  constructor(options) {
    super();
    assert(options.baseDir, 'Watcher constructor requires a baseDir option');
    this.baseDir = options.baseDir;
    this.extensions = options.extensions || Watcher.defaults.extensions;
    this.watcher = chokidar.watch(null, {
      cwd: this.baseDir,
      ignored: (filename) => {
        // Ignore filenames with extensions that aren't in the extensions list.
        const extension = extname(filename);
        return extension.length > 0 && this.extensions.indexOf(extension) === -1;
      }
    });
    this.watcher.on('ready', this.handleReady.bind(this));
    this.watcher.on('add', this.handleFileAdded.bind(this));
    this.watcher.on('change', this.handleFileChanged.bind(this));
    process.on('exit', this.stop.bind(this));
  }

  /**
   * Scans the specified paths (relative to the base directory) for files,
   * emitting an add event for each new file found, and a change event each time
   * a file is subsequently changed.
   * @param {...Array|...string} paths - The relative path(s) to scan.
   */
  watch(...paths) {
    this.watcher.add(flatten(paths));
  }
  /**
   * Loads the contents of a file from disk and creates a File to represent it.
   * @param {String} path - The filename of the file, relative to the baseDir.
   * @param {String} [encoding] - The file's encoding, or UTF8 if not specified.
   */
  load(path, encoding = 'utf8') {
    const filename = resolve(this.baseDir, path);
    const shortname = relative(this.baseDir, filename);
    const text = fs.readFileSync(filename, encoding);
    return new File(filename, shortname, text);
  }

  stop() {
    this.watcher.close();
  }

  handleReady() {
    this.emit('ready');
  }

  handleFileAdded(path) {
    this.emit('add', this.load(path));
  }

  handleFileChanged(path) {
    this.emit('change', this.load(path));
  }

}

Watcher.defaults = {
  extensions: ['.md', '.html', '.yml']
};

export default Watcher;
