import path from 'path';
import lsr from 'lsr';
import nconf from 'nconf';

class Scanner {

  constructor(options = {}) {
    this.baseDir = options.baseDir;
    this.regex = options.regex || /\.[md|html]$/;
  }

  scan(dir) {
    const fullPath = path.resolve(this.baseDir, dir);

    const docs = [];
    lsr.sync(fullPath).forEach(stat => {
      if (this.regex.test(stat.path)) {
        const filename = path.resolve(fullPath, stat.path);
        docs.push(filename);
      }
    });

    return docs;
  }

}

module.exports = Scanner;
