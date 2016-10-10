import EventEmitter from 'events';
import fs from 'fs';
import { resolve } from 'path';
import File from '../../../lib/pipeline/models/File';

class FakeScanner extends EventEmitter {

  constructor(options) {
    super();
    this.baseDir = options.baseDir;
  }

  add(paths) {
  }

  stop() {
  }

  simulateAdd(path) {
    this.emit('add', this.createFile(path));
  }

  simulateChange(path) {
    this.emit('change', this.createFile(path));
  }

  createFile(path) {
    const filename = resolve(this.baseDir, path);
    const text = fs.readFileSync(filename, 'utf8');
    return new File(filename, path, text);
  }

}

export default FakeScanner;
