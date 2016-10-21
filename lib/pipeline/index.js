import { resolve } from 'path';
import nconf from 'nconf';
import _ from 'lodash';
import Cache from './Cache';
import Compiler from './Compiler';
import Watcher from './Watcher';
import vars from './vars';
import AbsoluteLinksPlugin from './plugins/content/AbsoluteLinksPlugin';
import MarkdownPlugin from './plugins/content/MarkdownPlugin';
import ReplaceIncludesPlugin from './plugins/content/ReplaceIncludesPlugin';
import RelativePathPlugin from './plugins/content/RelativePathPlugin';
import ReplaceMediaPathPlugin from './plugins/content/ReplaceMediaPathPlugin';
import AutoEditUrlPlugin from './plugins/metadata/AutoEditUrlPlugin';
import AutoSectionPlugin from './plugins/metadata/AutoSectionPlugin';
import AutoTitlePlugin from './plugins/metadata/AutoTitlePlugin';
import AutoUrlPlugin from './plugins/metadata/AutoUrlPlugin';
import FlagsPlugin from './plugins/metadata/FlagsPlugin';
import IndexMergePlugin from './plugins/metadata/IndexMergePlugin';
import ArticlesCollection from './reducers/ArticlesCollection';
import PlatformsReducer from './reducers/PlatformsReducer';
import QuickstartsReducer from './reducers/QuickstartsReducer';
import SnippetsCollection from './reducers/SnippetsCollection';
import TagsReducer from './reducers/TagsReducer';

// Register a mixin for use by lodash templates.
_.mixin({ capitalize: (str) => str.charAt(0).toUpperCase() + str.substring(1) });

// Create the compiler.
const compiler = new Compiler({ vars });

// Register metadata transformers.
compiler.use(new FlagsPlugin());
compiler.use(new AutoTitlePlugin());
compiler.use(new AutoUrlPlugin());
compiler.use(new AutoEditUrlPlugin());
compiler.use(new AutoSectionPlugin());
compiler.use(new IndexMergePlugin());

// Register content transformers.
compiler.use(new MarkdownPlugin());
compiler.use(new ReplaceIncludesPlugin({
  snippetsDir: resolve(nconf.get('DOCS_PATH'), 'snippets')
}));
compiler.use(new ReplaceMediaPathPlugin({ mediaUrl: nconf.get('MEDIA_URL') }));
compiler.use(new RelativePathPlugin());
compiler.use(new AbsoluteLinksPlugin({
  domain: nconf.get('DOMAIN_URL_DOCS').replace('/docs', '')
}));

const watcher = new Watcher({
  baseDir: nconf.get('DOCS_PATH')
});

const cache = new Cache({
  compiler,
  watcher
});

// Watch the filesystem for changes.
watcher.watch('articles', 'snippets', 'updates');

export default cache;
