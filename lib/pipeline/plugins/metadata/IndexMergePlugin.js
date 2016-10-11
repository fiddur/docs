import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';

class IndexMergePlugin {

  constructor(options = {}) {
    this.resolve = options.resolve || IndexMergePlugin.defaults.resolve;
    this.load = options.load || IndexMergePlugin.defaults.load;
  }

  getMetadata(meta, content) {
    const indexFilename = this.resolve(meta.filename);
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

IndexMergePlugin.defaults = {
  resolve: (filename) => path.join(path.dirname(filename), 'index.yml'),
  load: yaml.safeLoad
};

export default IndexMergePlugin;
