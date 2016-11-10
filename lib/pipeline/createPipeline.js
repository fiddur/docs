import { resolve } from 'path';
import d from 'debug';
import nconf from 'nconf';
import _ from 'lodash';
import Cache from './Cache';
import Compiler from './Compiler';
import Watcher from './Watcher';
import UrlFormatter from './UrlFormatter';
import vars from '../vars';
import { getAppTypes } from './util';
import MarkdownPlugin from './plugins/content/MarkdownPlugin';
import NormalizeContentUrlsPlugin from './plugins/content/NormalizeContentUrlsPlugin';
import ReplaceIncludesPlugin from './plugins/content/ReplaceIncludesPlugin';
import AutoEditUrlPlugin from './plugins/metadata/AutoEditUrlPlugin';
import AutoSectionPlugin from './plugins/metadata/AutoSectionPlugin';
import AutoTitlePlugin from './plugins/metadata/AutoTitlePlugin';
import FlagsPlugin from './plugins/metadata/FlagsPlugin';
import IndexMergePlugin from './plugins/metadata/IndexMergePlugin';
import NormalizeUrlsPlugin from './plugins/metadata/NormalizeUrlsPlugin';
import ArticlesReducer from './reducers/ArticlesReducer';
import ConnectionsReducer from './reducers/ConnectionsReducer';
import QuickstartsReducer from './reducers/QuickstartsReducer';
import PlatformsReducer from './reducers/PlatformsReducer';
import SitemapReducer from './reducers/SitemapReducer';
import SnippetsReducer from './reducers/SnippetsReducer';
import UpdatesReducer from './reducers/UpdatesReducer';

// Register a mixin for use by lodash templates.
_.mixin({ capitalize: (str) => str.charAt(0).toUpperCase() + str.substring(1) });

/**
 * Composes the production Cache, Compiler, and Watcher, registersr all plugins
 * and reducers, and starts the Watcher's initial scan of the filesystem.
 * @returns The Cache instance, which acts as a facade to the rest of the system.
 */
export default function createPipeline() {
  const debug = d('docs:pipeline');
  debug('Starting document pipeline.');

  const baseUrl = nconf.get('DOMAIN_URL_DOCS');
  const mediaUrl = nconf.get('MEDIA_URL');

  const baseDir = nconf.get('DOCS_PATH');
  const snippetsDir = resolve(baseDir, 'snippets');
  const articlesDir = resolve(baseDir, 'articles');
  const updatesDir = resolve(baseDir, 'updates');

  const appTypes = getAppTypes();
  const urlFormatter = new UrlFormatter({ baseUrl, mediaUrl });

  // Create the compiler.
  const compiler = new Compiler({ vars });

  // Register metadata transformers.
  compiler.use(new FlagsPlugin());
  compiler.use(new AutoTitlePlugin());
  compiler.use(new AutoEditUrlPlugin());
  compiler.use(new AutoSectionPlugin());
  compiler.use(new IndexMergePlugin());
  compiler.use(new NormalizeUrlsPlugin({ urlFormatter }));

  // Register content transformers.
  compiler.use(new MarkdownPlugin());
  compiler.use(new ReplaceIncludesPlugin({ snippetsDir }));
  compiler.use(new NormalizeContentUrlsPlugin({ urlFormatter }));

  const watcher = new Watcher({ baseDir });
  const cache = new Cache({
    compiler,
    watcher,
    urlFormatter,
    reducers: {
      articles: new ArticlesReducer(),
      connections: new ConnectionsReducer({ urlFormatter }),
      platforms: new PlatformsReducer({ appTypes, articlesDir, urlFormatter }),
      quickstarts: new QuickstartsReducer({ appTypes, articlesDir, urlFormatter }),
      sitemap: new SitemapReducer({ appTypes, articlesDir, baseUrl }),
      snippets: new SnippetsReducer({ snippetsDir }),
      updates: new UpdatesReducer({ updatesDir })
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
