class AutoUrlPlugin {

  getMetadata(meta, content) {
    if (!meta.url) {
      const url = `/${meta.path.replace(/\.[\w]+$/, '').replace(/\/index$/, '')}`;
      return { url };
    }

    return null;
  }

}

export default AutoUrlPlugin;
