export default function createRenderer(template, doc, cache, vars) {
  // Create a simple wrapper around the Cache instance so we can
  // track calls to cache lookups, and add the resulting documents
  // as dependencies of the calling document.
  const wrapper = {
    get: (path) => {
      const dep = cache.get(path);
      if (dep) doc.addDependency(dep.filename);
      return dep;
    },
    getByFilename: (filename) => {
      const dep = cache.get(filename);
      if (dep) doc.addDependency(dep.filename);
      return dep;
    },
    getByUrl: (url) => {
      const dep = cache.getByUrl(url);
      if (dep) doc.addDependency(dep.filename);
      return dep;
    },
    find: (query) => {
      const deps = cache.find(query);
      deps.forEach(dep => doc.addDependency(dep.filename));
      return deps;
    }
  };

  // Create the "render context", a hash of values that will be passed to the
  // template function. The structure will be:
  // { meta: <Document>,
  //   cache: <Cache wrapper>,
  //   ...global environmental vars }
  const context = Object.assign({ meta: doc, cache: wrapper }, vars);

  // Return a closure that calls the template function using the render context.
  return () => template(context);
}
