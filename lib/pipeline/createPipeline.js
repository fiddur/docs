import { resolve } from 'path';
import d from 'debug';
import nconf from 'nconf';
import _ from 'lodash';
import Cache from './Cache';
import Compiler from './Compiler';
import Watcher from './Watcher';
import UrlFormatter from './UrlFormatter';
import vars from './vars';
import { getAppTypes } from './util';
import AbsoluteLinksPlugin from './plugins/content/AbsoluteLinksPlugin';
import MarkdownPlugin from './plugins/content/MarkdownPlugin';
import NormalizeUrlsPlugin from './plugins/content/NormalizeUrlsPlugin';
import ReplaceIncludesPlugin from './plugins/content/ReplaceIncludesPlugin';
import RelativePathPlugin from './plugins/content/RelativePathPlugin';
import AutoEditUrlPlugin from './plugins/metadata/AutoEditUrlPlugin';
import AutoSectionPlugin from './plugins/metadata/AutoSectionPlugin';
import AutoTitlePlugin from './plugins/metadata/AutoTitlePlugin';
import AutoUrlPlugin from './plugins/metadata/AutoUrlPlugin';
import FlagsPlugin from './plugins/metadata/FlagsPlugin';
import IndexMergePlugin from './plugins/metadata/IndexMergePlugin';
import ConnectionsReducer from './reducers/ConnectionsReducer';
import QuickstartsReducer from './reducers/QuickstartsReducer';
import PlatformsReducer from './reducers/PlatformsReducer';
import SnippetsReducer from './reducers/SnippetsReducer';

// Register a mixin for use by lodash templates.
_.mixin({ capitalize: (str) => str.charAt(0).toUpperCase() + str.substring(1) });

export default function createPipeline() {
  const debug = d('docs:pipeline');
  debug('Starting document pipeline.');

  const baseDir = nconf.get('DOCS_PATH');
  const snippetsDir = resolve(baseDir, 'snippets');
  const articlesDir = resolve(baseDir, 'articles');
  const appTypes = getAppTypes();

  const urlFormatter = new UrlFormatter({
    baseUrl: nconf.get('DOMAIN_URL_DOCS'),
    mediaUrl: nconf.get('MEDIA_URL')
  });

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
  compiler.use(new ReplaceIncludesPlugin({ snippetsDir }));
  compiler.use(new NormalizeUrlsPlugin({ urlFormatter }));
  compiler.use(new RelativePathPlugin());

  const watcher = new Watcher({ baseDir });
  const cache = new Cache({
    compiler,
    watcher,
    reducers: {
      platforms: new PlatformsReducer({ appTypes, articlesDir, urlFormatter }),
      quickstarts: new QuickstartsReducer({ appTypes, articlesDir, urlFormatter }),
      connections: new ConnectionsReducer({ urlFormatter }),
      snippets: new SnippetsReducer({ snippetsDir })
    }
  });

  // Watch the filesystem for changes.
  debug('Scanning filesystem for documents...');
  watcher.watch('articles', 'snippets', 'updates');

  // When the cache is ready, render all of the documents.
  cache.whenReady(() => {
    debug(`Pre-rendering ${cache.getStats().count} documents...`);
    cache.warm();
    debug('Document pipeline ready.');
  });

  return cache;
}
