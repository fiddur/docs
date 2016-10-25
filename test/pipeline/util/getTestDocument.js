import matter from 'gray-matter';
import { merge } from 'lodash';
import Document from '../../../lib/pipeline/models/Document';

export default function getTestDocument(file, metadata = {}) {
  const meta = merge(metadata, matter(file.text).data);
  return new Document(file, meta);
}
