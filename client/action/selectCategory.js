export default function selectCategory(context, route, done) {
  let {category} = route;
  context.dispatch('CATEGORY_SELECTED', {category});
  if (done) done();
}
