import {parse} from 'url';
import NavigationStore from '../stores/NavigationStore';

export default function selectSection(context, payload, done) {

  let {section, url} = payload;

  if (!section && url) {
    let {pathname} = parse(url);
    section = context.getStore(NavigationStore).getSectionForArticle(pathname);
  }

  context.dispatch('SECTION_SELECTED', {section});
  if (done) done();

}
