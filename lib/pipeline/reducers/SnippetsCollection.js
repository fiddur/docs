import Collection from '../models/Collection';

/**
 * A Collection that contains all of the non-include, non-special Markdown
 * documents inside the /snippets/ directory.
 */
class SnippetsCollection extends Collection {

  filter(doc) {
    return (
      // Only consider documents within the /articles/ path.
      doc.path.indexOf('/snippets/') === 0 &&
      // Only consider Markdown documents.
      doc.extension === '.md' &&
      // Ignore includes.
      !doc.isInclude &&
      // Ignore documents beginning with an underscore.
      !doc.isSpecial
    );
  }

}

export default SnippetsCollection;
