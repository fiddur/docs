import {parse} from 'url';
import NavigationStore from '../stores/NavigationStore';

export default function selectSection(context, payload, done) {

  let {section, url} = payload;

  if (!section && url) {
    let {pathname} = parse(url);
    let metadata = context.getStore(NavigationStore).getMetadata(pathname);
    section = metadata ? metadata.section : 'articles';
  }

  context.dispatch('SECTION_SELECTED', {section});
  if (done) done();

}
