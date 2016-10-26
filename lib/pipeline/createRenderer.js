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

  // We want to make the cache wrapper, the document's metadata,
  // and the global vars available to the template.
  const context = Object.assign({ cache: wrapper, meta: doc }, vars);

  // Return the renderer, a closure that calls the template function
  // using the render context.
  return () => template(context);
}
