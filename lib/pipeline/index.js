import path from 'path';
import nconf from 'nconf';
import _ from 'lodash';
import Scanner from './Scanner';
import Compiler from './Compiler';
import Cache from './Cache';
import MarkdownPlugin from './plugins/MarkdownPlugin';
import ReplaceMediaPathPlugin from './plugins/ReplaceMediaPathPlugin';
import RelativePathPlugin from './plugins/RelativePathPlugin';
import AutoTitlePlugin from './plugins/AutoTitlePlugin';
import AutoUrlPlugin from './plugins/AutoUrlPlugin';
import AutoSectionPlugin from './plugins/AutoSectionPlugin';
import PublicAndSitemapPlugin from './plugins/PublicAndSitemapPlugin';
import IndexMergePlugin from './plugins/IndexMergePlugin';

_.mixin({
  capitalize: (str) => str.charAt(0).toUpperCase() + str.substring(1)
});

const scanner = new Scanner({ baseDir: nconf.get('DOCS_PATH') });
const compiler = new Compiler({ baseDir: nconf.get('DOCS_PATH') });
const cache = new Cache();

/* --- Initialize the compiler --- */

// Register content transformers
compiler.use(new MarkdownPlugin());
compiler.use(new ReplaceMediaPathPlugin({ mediaUrl: nconf.get('MEDIA_URL') }));
compiler.use(new RelativePathPlugin());

// Register metadata transformers
compiler.use(new AutoTitlePlugin());
compiler.use(new AutoUrlPlugin());
compiler.use(new AutoSectionPlugin());
compiler.use(new PublicAndSitemapPlugin());
compiler.use(new IndexMergePlugin());

/* --- Gather articles and store them in the cache --- */

['articles', 'snippets', 'updates'].forEach(dir => {
  const files = scanner.scan(dir);
  const docs = _.map(files, filename => compiler.load(filename));
  cache.add(docs);
});

export default { scanner, compiler, cache };
