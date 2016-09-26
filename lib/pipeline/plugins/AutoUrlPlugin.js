class AutoUrlPlugin {

  getMetadata(meta, content) {

    if (!meta.url) {
      let url = '/' + meta.path.replace(/\.[\w]+$/, '').replace(/\/index$/, '');
      return {url};
    }

  }

}

export default AutoUrlPlugin;
