import nconf from 'nconf';
import _ from 'lodash';
import Scanner from './Scanner';
import Compiler from './Compiler';
import Cache from './Cache';
import Pipeline from './Pipeline';
import MarkdownPlugin from './plugins/MarkdownPlugin';
import ReplaceMediaPathPlugin from './plugins/ReplaceMediaPathPlugin';
import RelativePathPlugin from './plugins/RelativePathPlugin';
import AutoTitlePlugin from './plugins/AutoTitlePlugin';
import AutoUrlPlugin from './plugins/AutoUrlPlugin';
import AutoSectionPlugin from './plugins/AutoSectionPlugin';
import PublicAndSitemapPlugin from './plugins/PublicAndSitemapPlugin';
import IndexMergePlugin from './plugins/IndexMergePlugin';

// Register a mixin for use by lodash templates.
_.mixin({ capitalize: (str) => str.charAt(0).toUpperCase() + str.substring(1) });

// Create the subsystems.
const scanner = new Scanner({ baseDir: nconf.get('DOCS_PATH') });
const compiler = new Compiler();
const cache = new Cache();

// Register content transformers.
compiler.use(new MarkdownPlugin());
compiler.use(new ReplaceMediaPathPlugin({ mediaUrl: nconf.get('MEDIA_URL') }));
compiler.use(new RelativePathPlugin());

// Register metadata transformers.
compiler.use(new AutoTitlePlugin());
compiler.use(new AutoUrlPlugin());
compiler.use(new AutoSectionPlugin());
compiler.use(new PublicAndSitemapPlugin());
compiler.use(new IndexMergePlugin());

// Create the pipeline and initialize it with the documents from disk.
const pipeline = new Pipeline({ scanner, compiler, cache });
pipeline.load(['articles', 'snippets', 'updates']);

export default pipeline;
