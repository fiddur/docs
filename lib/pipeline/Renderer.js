import path from 'path';
import _ from 'lodash';

class Renderer {

  /**
   * Renders a Document by joining the document's metadata with the specified
   * context hash, and calling the document's template function.
   * @param {Document} doc - The document to render.
   * @param {Pipeline} pipeline - The pipeline that is rendering the document.
   * @param {Object} parentContext - A hash of template variables in scope for the document.
   */
  render(doc, pipeline, parentContext) {
    const context = _.merge({}, parentContext, doc);

    // TODO: This is here for reverse compatibility, but since the document metadata
    // is merged into the Document object itself, we can remove this eventually.
    context.meta = doc;

    context.include = (file, includeVars = {}) => {
      const includeContext = _.merge({}, includeVars, context);
      const filename = path.join(path.dirname(doc.filename), file);
      let childDoc = pipeline.getByFilename(`${filename}.md`);
      if (!childDoc) {
        childDoc = pipeline.getByFilename(`${filename}.html`);
      }
      if (!childDoc) {
        throw new Error(`Could not find include ${filename} included from ${doc.filename}`);
      }
      return this.render(childDoc, pipeline, includeContext);
    };

    context.snippet = (hash) => {
      const snippet = context.snippets.findByHash(hash);
      if (snippet) {
        return this.render(doc, pipeline, context);
      }
      return undefined;
    };

    try {
      return doc.templateFunction(context);
    } catch (err) {
      err.message = `Error rendering ${doc.filename}: ${err.message}`;
      throw err;
    }
  }

}

export default Renderer;
