/**
 * Module dependencies.
 */


import nconf from 'nconf';
import lodashCompiler from './compilers/lodash';
import markdownCompiler from './compilers/markdown';
import mediaPathCompiler from './compilers/media-path';
import relativePathCompiler from './compilers/relative-path';
import unescapeCompiler from './compilers/unescape';


class DocCompiler {

  constructor(options) {
    this.options = options;
    let compilers = this.compilers = [];
    compilers.push(markdownCompiler(this.options));
    compilers.push(mediaPathCompiler(this.options));
    compilers.push(relativePathCompiler(this.options));
    compilers.push(unescapeCompiler(this.options));
    // This must be last as it turns the output into a template fn
    compilers.push(lodashCompiler(this.options));
  }

  compile(text) {
    for (var i = 0; i < this.compilers.length; i++) {
      text = this.compilers[i](text);
    }
    return text;
  }

}

export function compileTemplate(text, isMarkdown = true, isAmp = false) {
  var docCompiler = new DocCompiler({ isMarkdown: isMarkdown, isAmp: isAmp });
  return docCompiler.compile(text);
}

export function makeLinksAbsolute(text) {
  var docsDomain = nconf.get('DOMAIN_URL_DOCS');
  docsDomain = docsDomain.replace('/docs', '');

  return text.replace(/href="\//g, `href="${docsDomain}/`)
    .replace(/src="(\/[^\/]+)/ig, `src="${docsDomain}$1`);
}
