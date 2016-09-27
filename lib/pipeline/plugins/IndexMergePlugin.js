import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';

const defaultResolve = (meta, content) => path.join(path.dirname(meta.path), 'index.yml');

class IndexMergePlugin {

  constructor(options = {}) {
    this.resolve = options.resolve || defaultResolve;
    this.load = options.load || yaml.safeLoad;
  }

  getMetadata(meta, content) {
    const indexFilename = this.resolve(meta, content);
    if (fs.existsSync(indexFilename)) {
      try {
        const text = fs.readFileSync(indexFilename, 'utf8');
        return this.load(text);
      } catch (err) {
        err.message = `Error reading metadata from index file at ${indexFilename}: ${err.message}`;
        throw err;
      }
    }

    return null;
  }

}

export default IndexMergePlugin;
