import {parse} from 'url';
import selectSection from './selectSection';
import ContentStore, {ContentState} from '../stores/ContentStore';
import NavigationStore from '../stores/NavigationStore';

export default function loadContent(context, route, done) {

  let {ignoreMissing} = route;
  let url = parse(route.url).pathname;

  context.dispatch('CONTENT_SELECTED', {url});

  let metadata = context.getStore(NavigationStore).getMetadata(url);
  context.dispatch('UPDATE_PAGE_METADATA', {
    pageTitle: metadata.title,
    pageDescription: metadata.description
  });

  let success = (html) => {
    context.executeAction(selectSection, {url});
    context.dispatch('CONTENT_LOAD_SUCCESS', {url, html});
    if (done) done();
  };

  let failure = (err) => {
    context.dispatch('CONTENT_LOAD_FAILURE', {url, err});
    if (done) done(err);
  };

  // First, check to see if the content has already been loaded.
  let content = context.getStore(ContentStore).getContent(url);
  if (content) {
    if (content.state == ContentState.LOADED) {
      // If it has been loaded, just return the already-loaded content.
      return success(content.html);
    }
    else if (content.state == ContentState.LOADING) {
      // If it's already being loaded, don't load it again.
      return done();
    }
  }

  // If the content hasn't been loaded (or a previous load resulted in
  // an error), try to load it using the ContentService.
  context.dispatch('CONTENT_LOADING', {url});
  return context.getService('ContentService')
  .load(url, ignoreMissing)
  .then(success)
  .catch(failure);

}
