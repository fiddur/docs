import assert from 'assert';
import EventEmitter from 'events';
import { basename, extname, resolve } from 'path';
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
        // Ignore filenames which begin with an underscore.
        if (basename(filename).indexOf('_') === 0) return true;
        // Ignore filenames with extensions that aren't in the extensions list.
        const extension = extname(filename);
        return extension.length > 0 && this.extensions.indexOf(extension) === -1;
      }
    });
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

  stop() {
    this.watcher.close();
  }

  handleFileAdded(path) {
    this.emit('add', File.load(this.baseDir, path));
  }

  handleFileChanged(path) {
    this.emit('change', File.load(this.baseDir, path));
  }

}

Watcher.defaults = {
  extensions: ['.md', '.html']
};

export default Watcher;
