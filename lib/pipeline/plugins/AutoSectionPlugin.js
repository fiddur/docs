class AutoSectionPlugin {

  getMetadata(meta, content) {

    if (!meta.section) {
      return {section: 'articles'};
    }

  }

}

export default AutoSectionPlugin;
