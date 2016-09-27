class AutoSectionPlugin {

  getMetadata(meta, content) {
    if (!meta.section) {
      return { section: 'articles' };
    }

    return null;
  }

}

export default AutoSectionPlugin;
