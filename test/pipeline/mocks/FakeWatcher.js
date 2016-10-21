import EventEmitter from 'events';

class FakeWatcher extends EventEmitter {

  constructor(options) {
    super();
    this.baseDir = options.baseDir;
  }

  watch(paths) {
  }

  stop() {
  }

}

export default FakeWatcher;
