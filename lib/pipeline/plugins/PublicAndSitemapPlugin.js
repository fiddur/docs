class PublicAndSitemapPlugin {

  getMetadata(meta, content) {

    let patch = {
      public: meta.public !== false,
      sitemap: meta.sitemap !== false
    };

    let isInclude = meta.path.indexOf('_includes') !== -1;
    let isSpecial = meta.filename.indexOf('_') === 0;

    if (isInclude || isSpecial) {
      patch.public = false;
      patch.sitemap = false; 
    }

    return patch;
    
  }

}

export default PublicAndSitemapPlugin;
