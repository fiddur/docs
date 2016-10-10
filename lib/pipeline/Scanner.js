import fs from 'fs';
import EventEmitter from 'events';
import { extname, resolve } from 'path';
import chokidar from 'chokidar';
import File from './models/File';

/**
 * Searches the filesystem for article files.
 */
class Scanner extends EventEmitter {

  /**
   * Creates a Scanner.
   * @param {Object} options - An options hash.
   * @param {string} options.baseDir - The base (root) directory for articles.
   * @param {Array<string>} [options.extensions] - File extensions to include.
   */
  constructor(options) {
    super();
    if (!options.baseDir) {
      throw new Error('Scanner constructor requires a baseDir option');
    }
    this.baseDir = options.baseDir;
    this.extensions = options.extensions || ['.md', '.html'];
    this.watcher = chokidar.watch(null, {
      cwd: this.baseDir,
      ignored: (filename) => {
        const extension = extname(filename);
        return extension.length > 0 && this.extensions.indexOf(extension) === -1;
      }
    });
    this.watcher.on('add', this.handleFileAdded.bind(this));
    this.watcher.on('change', this.handleFileChanged.bind(this));
  }

  scan(paths) {
    this.watcher.add(paths);
  }

  stop() {
    this.watcher.close();
  }

  handleFileAdded(path) {
    this.emit('add', this.readFile(path));
  }

  handleFileChanged(path) {
    this.emit('change', this.readFile(path));
  }

  readFile(path) {
    const filename = resolve(this.baseDir, path);
    const text = fs.readFileSync(filename, 'utf8');
    return new File(filename, path, text);
  }

}

export default Scanner;
