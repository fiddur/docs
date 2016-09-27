import Reducer from '../models/Reducer';
import pipeline from '../';

/**
 * Groups Documents by tags by reducing an array of Documents
 * into a map from tag -> Document[].
 */
class TagsReducer extends Reducer {

  constructor() {
    super({});
  }

  filter(doc) {
    return (
      // Only consider documents within the /articles/ path.
      doc.path.indexOf('/articles/') === 0 &&
      // Only consider Markdown documents.
      doc.extension === '.md' &&
      // Ignore includes.
      !doc.isInclude &&
      // Ignore documents beginning with an underscore.
      !doc.isSpecial &&
      // Only consider documents with tags.
      doc.tags && doc.tags.length > 0
    );
  }

  reduce(doc) {
    doc.tags.forEach(tag => {
      this.value[tag] = this.value[tag] || [];
      this.value[tag].push(doc);
    });
  }

}

export default TagsReducer;
