class PublicAndSitemapPlugin {

  getMetadata(meta, content) {
    const patch = {
      public: meta.public !== false,
      sitemap: meta.sitemap !== false
    };

    const isInclude = meta.path.indexOf('_includes') !== -1;
    const isSpecial = meta.filename.indexOf('_') === 0;

    if (isInclude || isSpecial) {
      patch.public = false;
      patch.sitemap = false;
    }

    return patch;
  }

}

export default PublicAndSitemapPlugin;
