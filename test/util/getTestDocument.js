import matter from 'gray-matter';
import { merge } from 'lodash';
import Document from '../../lib/pipeline/models/Document';

/**
 * Creates a Document from the specified File for the purposes of testing.
 * Also accepts an optional hash of metadata to allow for overriding of
 * metadata read from the article's front matter. This lets us bypass
 * the use of a lot of the plugins that would normally add this metadata
 * in the production pipeline.
 * @param {File} file - The file from which to create the Document.
 * @param {Object} [metadataOverrides] - A hash of metadata properties to set or override.
 * @returns {Document} The created Document.
 */
export default function getTestDocument(file, metadataOverrides = {}) {
  const meta = merge({}, matter(file.text).data, metadataOverrides);
  return new Document(file, meta);
}
