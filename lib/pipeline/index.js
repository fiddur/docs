import nconf from 'nconf';
import _ from 'lodash';
import Cache from './Cache';
import Compiler from './Compiler';
import Pipeline from './Pipeline';
import Renderer from './Renderer';
import Scanner from './Scanner';
import strings from '../strings';
import { createDefaultRenderContext } from './util';
import AbsoluteLinksPlugin from './plugins/content/AbsoluteLinksPlugin';
import MarkdownPlugin from './plugins/content/MarkdownPlugin';
import ReplaceIncludesPlugin from './plugins/content/ReplaceIncludesPlugin';
import RelativePathPlugin from './plugins/content/RelativePathPlugin';
import ReplaceMediaPathPlugin from './plugins/content/ReplaceMediaPathPlugin';
import UnescapePlugin from './plugins/content/UnescapePlugin';
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

// Assemble the pipeline.
const pipeline = new Pipeline({
  cache: new Cache(),
  compiler: new Compiler(),
  renderer: new Renderer(),
  scanner: new Scanner({ baseDir: nconf.get('DOCS_PATH') })
});

// Register metadata transformers.
pipeline.use(new FlagsPlugin());
pipeline.use(new AutoTitlePlugin());
pipeline.use(new AutoUrlPlugin());
pipeline.use(new AutoEditUrlPlugin());
pipeline.use(new AutoSectionPlugin());
pipeline.use(new IndexMergePlugin());

// Register content transformers.
pipeline.use(new MarkdownPlugin());
pipeline.use(new ReplaceIncludesPlugin());
pipeline.use(new ReplaceMediaPathPlugin({ mediaUrl: nconf.get('MEDIA_URL') }));
pipeline.use(new RelativePathPlugin());
pipeline.use(new UnescapePlugin());
pipeline.use(new AbsoluteLinksPlugin({
  domain: nconf.get('DOMAIN_URL_DOCS').replace('/docs', '')
}));

// Load the documents from disk.
pipeline.watch(['articles', 'snippets', 'updates']);

const environment = {

  // Reductions
  articles: [],
  snippets: [],
  quickstarts: [],
  tags: [],

  // URLs
  manage_url: `${(process.env.NODE_ENV === 'production') ? 'https' : 'http'}://${nconf.get('DOMAIN_URL_APP')}`,
  auth0js_url: nconf.get('AUTH0JS_URL'),
  lock_url: nconf.get('LOCK_URL'),
  lock_passwordless_url: nconf.get('LOCK_PASSWORDLESS_URL'),

  // Environment variables
  env: {
    DOMAIN_URL_DOCS: nconf.get('DOMAIN_URL_DOCS'),
    MEDIA_URL: nconf.get('MEDIA_URL'),
    AUTH0_DOMAIN: nconf.get('AUTH0_DOMAIN'),
    AUTH0_CLIENT_ID: nconf.get('AUTH0_CLIENT_ID'),
    DOMAIN_URL_SERVER: nconf.get('DOMAIN_URL_SERVER'),
    SEGMENT_KEY: nconf.get('SEGMENT_KEY'),
    DWH_ENDPOINT: nconf.get('DWH_ENDPOINT'),
    PINGDOM_ID: nconf.get('PINGDOM_ID'),
    SENTRY_DSN: nconf.get('SENTRY_DSN'),
    MOUSEFLOW_ID: nconf.get('MOUSEFLOW_ID')
  },

  site: {
    title: strings.SITE_TITLE
  }

};

// We're ready! Render everything.
pipeline.init(environment);

export default pipeline;
