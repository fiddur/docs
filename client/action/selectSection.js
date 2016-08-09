import NavigationStore from '../stores/NavigationStore';

export default function selectSection(context, payload, done) {

  let {section, url} = payload;

  if (!section && url) {
    section = context.getStore(NavigationStore).getSectionForArticle(url);
  }

  context.dispatch('SECTION_SELECTED', {section});
  if (done) done();

}
