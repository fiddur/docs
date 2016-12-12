import { parse } from 'url';
import DocumentStore from '../stores/DocumentStore';
import LoadState from '../stores/LoadState';
import normalizeUrl from '../util/normalizeUrl';

export default function loadDocument(context, payload, done) {
  const logger = context.getService('LoggingService');
  const url = normalizeUrl(payload.url);

  context.dispatch('DOCUMENT_SELECTED', { url });

  const success = (doc) => {
    if (!doc.meta.quickstart) {
      context.dispatch('UPDATE_PAGE_METADATA', {
        pageTitle: doc.meta.title,
        pageDescription: doc.meta.description
      });
    }
    context.dispatch('DOCUMENT_LOAD_SUCCESS', { url, doc });
    logger.debug('Document loaded successfully.', { url });
    if (done) done();
  };

  const failure = (err) => {
    context.dispatch('DOCUMENT_LOAD_FAILURE', { url, err });
    logger.warn('Error loading document.', { url, err });
    if (done) done();
  };

  // First, check to see if the doc has already been loaded.
  const doc = context.getStore(DocumentStore).getDocument(url);
  if (doc) {
    if (doc.state === LoadState.LOADED) {
      // If it has been loaded, just return it.
      return success(doc);
    } else if (doc.state === LoadState.LOADING) {
      // If it's already being loaded, don't load it again.
      return done();
    }
  }

  // If the document hasn't been loaded (or a previous load resulted in
  // an error), try to load it using the DocumentService.
  context.dispatch('DOCUMENT_LOADING', { url });
  return context.getService('DocumentService')
  .load(url)
  .then(success)
  .catch(failure);
}
