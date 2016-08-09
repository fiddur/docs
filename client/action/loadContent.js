import selectSection from './selectSection';

export default function loadContent(context, route, done) {

  let {url, ignoreMissing} = route;

  context.dispatch('CONTENT_SELECTED', {url});

  return context.getService('ContentService')
  .load(url, ignoreMissing)
  .then(html => {
    context.executeAction(selectSection, {url});
    context.dispatch('CONTENT_LOAD_SUCCESS', {url, html});
    if (done) done();
  })
  .catch(err => {
    context.dispatch('CONTENT_LOAD_FAILURE', {url, err});
    if (done) done(err);
  });

}
