import EventEmitter from 'events';

class FakeCache extends EventEmitter {

  constructor() {
    super();
    this.docsByPath = {};
    this.docsByFilename = {};
    this.docsByUrl = {};
  }

  add(doc) {
    this.docsByPath[doc.path] = doc;
    this.docsByFilename[doc.filename] = doc;
    this.docsByUrl[doc.meta.url] = doc;
    this.emit('add', doc);
  }

  warm() {
    Object.keys(this.docsByPath)
    .forEach(path => {
      const doc = this.docsByPath[path];
      doc.getContent();
    });
  }

  get(path) {
    return this.docsByPath[path];
  }

  getByFilename(filename) {
    return this.docsByFilename[filename];
  }

  getByUrl(url) {
    return this.docsByUrl[url];
  }

  find(query) {
    return Object.keys(this.docsByPath)
    .filter(path => path.indexOf(query) === 0)
    .map(path => this.docsByPath[path]);
  }

}

FakeCache.defaults = {
  documentPaths: [/^articles/]
};

export default FakeCache;
