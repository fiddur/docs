export default function loadContent(context, route, done) {

  let {category, url} = route;

  context.dispatch('CONTENT_SELECTED', {url});
  context.dispatch('CATEGORY_SELECTED', {category});

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
