import fs from 'fs';
import EventEmitter from 'events';
import { relative, resolve } from 'path';
import File from '../../../lib/pipeline/models/File';

class FakeWatcher extends EventEmitter {

  constructor(options) {
    super();
    this.baseDir = options.baseDir;
  }

  watch(paths) {
  }

  stop() {
  }

  load(path, encoding = 'utf8') {
    const filename = resolve(this.baseDir, path);
    const shortname = relative(this.baseDir, filename);
    const text = fs.readFileSync(filename, encoding);
    return new File(filename, shortname, text);
  }

}

export default FakeWatcher;
