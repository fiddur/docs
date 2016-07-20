export default function loadContent(context, route, done) {

  let {section, url} = route;

  context.dispatch('CONTENT_SELECTED', {url});
  context.dispatch('SECTION_SELECTED', {section});

  return context.getService('ContentService')
  .load(url)
  .then(html => {
    context.dispatch('CONTENT_LOAD_SUCCESS', {url, html});
    if (done) done();
  })
  .catch(err => {
    context.dispatch('CONTENT_LOAD_FAILURE', {url, err});
    if (done) done(err);
  });

}
