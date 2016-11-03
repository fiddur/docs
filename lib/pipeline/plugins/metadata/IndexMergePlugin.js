import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import { omit } from 'lodash';

class IndexMergePlugin {

  constructor(options = {}) {
    this.resolve = options.resolve || IndexMergePlugin.defaults.resolve;
    this.load = options.load || IndexMergePlugin.defaults.load;
  }

  getMetadata(doc, content) {
    const indexFilename = this.resolve(doc.filename);
    if (fs.existsSync(indexFilename)) {
      try {
        const text = fs.readFileSync(indexFilename, 'utf8');
        const metadata = this.load(text);
        // Return only the properties that aren't already set on the document.
        return omit(metadata, doc.getMetadataProperties());
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
