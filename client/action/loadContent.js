import { parse } from 'url';
import ContentStore from '../stores/ContentStore';
import LoadState from '../stores/LoadState';

export default function loadContent(context, route, done) {
  const logger = context.getService('LoggingService');
  const url = parse(route.url).pathname;

  context.dispatch('CONTENT_SELECTED', { url });

  const success = (content) => {
    context.dispatch('UPDATE_PAGE_METADATA', {
      pageTitle: content.meta.title,
      pageDescription: content.meta.description
    });
    context.dispatch('CONTENT_LOAD_SUCCESS', { url, content });
    logger.debug('Content loaded successfully.', { url });
    if (done) done();
  };

  const failure = (err) => {
    context.dispatch('CONTENT_LOAD_FAILURE', { url, err });
    logger.warn('Error loading content.', { url, err });
    if (done) done();
  };

  // First, check to see if the content has already been loaded.
  const content = context.getStore(ContentStore).getContent(url);
  if (content) {
    if (content.state === LoadState.LOADED) {
      // If it has been loaded, just return the already-loaded content.
      return success(content);
    } else if (content.state === LoadState.LOADING) {
      // If it's already being loaded, don't load it again.
      return done();
    }
  }

  // If the content hasn't been loaded (or a previous load resulted in
  // an error), try to load it using the ContentService.
  context.dispatch('CONTENT_LOADING', { url });
  return context.getService('ContentService')
  .load(url)
  .then(success)
  .catch(failure);
}
