import { docsByFilename } from './builder';
import quickstarts from '../collections/quickstarts';
import articles from '../collections/articles';
import snippets from '../collections/snippets';
import tags from '../collections/articles-tags';
import { lockSDKTemplate, lockBrowserTemplate } from '../sdk-snippets/lock';
import path from 'path';
import _ from 'lodash';
import { makeLinksAbsolute } from './compiler';

function include(locals, parentFilename, file, sectionOrlocals, section) {
  var locals = _.clone(locals);
  if (sectionOrlocals) {
    if (typeof sectionOrlocals === 'string') {
      section = sectionOrlocals;
    } else {
      locals = _.merge(locals, sectionOrlocals);
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
  var content = idoc.render(locals);
  return content;
};

export function renderContent(doc, locals, absoluteLinks) {
  locals.include = include.bind(null, locals, doc.filename);
  locals.quickstarts = quickstarts;
  locals.articles = articles;
  locals.snippets = snippets;
  locals.snippet = function(hash) {
    var snippet = snippets.findByHash(hash);
    if (snippet) {
      return snippet.content(locals);
    }
  };
  locals.tags = tags;


  locals.browser = lockBrowserTemplate(locals);
  locals.lockSDK = lockSDKTemplate(locals);

  var canonicalUrl = doc.meta.canonical;
  if (canonicalUrl) {
    canonicalUrl = nconf.get('DOMAIN_URL_DOCS') + canonicalUrl;
  }
  locals.canonicalUrl = canonicalUrl;
  locals.title = doc.meta.title;
  locals.description = doc.meta.description;
  locals.meta = doc.meta;
  locals.editUrl = 'https://github.com/auth0/docs/edit/master/articles/' + doc.filename;


  var html = doc.render(locals);
  if (absoluteLinks === true) {
    html = makeLinksAbsolute(html);
  }

  return html;
}
