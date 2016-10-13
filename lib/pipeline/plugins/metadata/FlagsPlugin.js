class FlagsPlugin {

  // TODO: isInclude and isSpecial is probably not necessary now that we're not treating includes
  // as full documents.
  getMetadata(doc, content) {
    const patch = {
      public: doc.public !== false,
      sitemap: doc.sitemap !== false,
      isInclude: doc.filename.indexOf('_includes') !== -1,
      isSpecial: doc.hash.indexOf('_') === 0
    };

    // Ensure that includes and special documents aren't public nor included in the sitemap.
    if (patch.isInclude || patch.isSpecial) {
      patch.public = false;
      patch.sitemap = false;
    }

    return patch;
  }

}

export default FlagsPlugin;
