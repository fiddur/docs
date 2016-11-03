class FlagsPlugin {

  getMetadata(doc, content) {
    // This will normalize the public and sitemap properties to Boolean values.
    return {
      public: doc.public !== false,
      sitemap: doc.sitemap !== false
    };
  }

}

export default FlagsPlugin;
