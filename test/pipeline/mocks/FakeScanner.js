import EventEmitter from 'events';
import fs from 'fs';
import { resolve } from 'path';
import File from '../../../lib/pipeline/models/File';

class FakeWatcher extends EventEmitter {

  constructor(options) {
    super();
    this.baseDir = options.baseDir;
  }

  add(paths) {
  }

  stop() {
  }

  simulateAdd(path) {
    this.emit('add', new File(this.baseDir, path));
  }

  simulateChange(path) {
    this.emit('change', new File(this.baseDir, path));
  }

}

export default FakeWatcher;
