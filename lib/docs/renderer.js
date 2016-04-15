import { docsByFilename } from './builder';
import quickstart from '../quickstart';
import articles from '../collections/articles';
import snippets from '../collections/snippets';
import tags from '../collections/articles-tags';
import path from 'path';
import _ from 'lodash';
import { makeLinksAbsolute } from './compiler';

function include(locals, parentFilename, file, sectionOrContext, section) {
  var context = locals;
  if (sectionOrContext) {
    if (typeof sectionOrContext === 'string') {
      section = sectionOrContext;
    } else {
      context = _.merge(context, sectionOrContext);
    }
  }
  var filename = path.join(path.dirname(parentFilename), file);
  section = section || 'content';
  var idoc = docsByFilename[filename  + '.md'];
  if (!idoc) {
    idoc = docsByFilename[filename  + '.html'];
  }
  if (!idoc) {
    throw new Error('Could not find include ' + file);
  }
  var content = idoc.template(context);
  return content;
};

function renderContent(doc, context, absoluteLinks) {
  context.include = include.bind(null, context, doc.filename);
  context.quickstart = quickstart;
  context.articles = articles;
  context.snippets = snippets;
  context.snippet = function(hash) {
    var snippet = snippets.findByHash(hash);
    if (snippet) {
      return snippet.content(context);
    }
  };
  context.tags = tags;


  context.browser = '';
  context.lockSDK = '';

  var conanicalUrl = doc.meta.canonical;
  if (conanicalUrl) {
    conanicalUrl = nconf.get('DOMAIN_URL_DOCS') + conanicalUrl;
  }
  context.canonicalUrl = conanicalUrl;
  context.title = doc.meta.title;
  context.meta = doc.meta;
  context.editUrl = 'https://github.com/auth0/docs/edit/master/articles/' + doc.filename;


  var html = doc.template(context);
  if (absoluteLinks === true) {
    html = makeLinksAbsolute(html);
  }

  return html;
}

export default function processSections(doc, context, absoluteLinks) {
  var content = renderContent(doc, context, absoluteLinks);
  return { 'content': content };
}
