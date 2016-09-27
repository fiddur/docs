import Reducer from '../models/Reducer';
import pipeline from '../';

/**
 * TODO
 */
class QuickstartsCollection extends Reducer {

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
      !doc.isSpecial
    );
  }

  reduce(doc) {
  }

}

export default QuickstartsCollection;
