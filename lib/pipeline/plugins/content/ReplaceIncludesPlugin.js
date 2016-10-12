import fs from 'fs';
import { dirname, extname, resolve } from 'path';
import _ from 'lodash';
import { captureVars, createDefaultMarkdownRenderer } from '../../util';

class ReplaceIncludesPlugin {

  constructor(options = {}) {
    this.regex = options.regex || ReplaceIncludesPlugin.defaults.regex;
    this.markdown = options.markdown || ReplaceIncludesPlugin.defaults.markdown;
    this.compileTemplate = options.compileTemplate || ReplaceIncludesPlugin.defaults.compileTemplate;
  }

  transform(meta, content) {
    const regex = new RegExp(this.regex);
    let match;
    let result = content;
    while (match = regex.exec(content)) { // eslint-disable-line no-cond-assign
      const [text, relativeFilename, variableHash] = match;
      const localVars = variableHash ? captureVars(variableHash) : {};
      const filename = this.resolveInclude(meta.filename, relativeFilename);
      const rendered = this.renderInclude(filename, meta, localVars);
      result = result.replace(text, rendered);
    }
    return result;
  }

  resolveInclude(parentFilename, includeFilename) {
    const base = resolve(dirname(parentFilename), includeFilename);
    if (fs.existsSync(base)) return base;
    if (fs.existsSync(`${base}.md`)) return `${base}.md`;
    if (fs.existsSync(`${base}.html`)) return `${base}.html`;
    throw new Error(`Error resolving include ${includeFilename} included from file ${parentFilename}`);
  }

  renderInclude(filename, meta, localVars) {
    try {
      let content = fs.readFileSync(filename, 'utf8');
      if (extname(filename) === '.md') {
        content = this.markdown.render(content);
      }
      const template = this.compileTemplate(content);
      const context = _.merge({}, meta, localVars);
      return template(context);
    } catch (err) {
      err.message = `Error rendering include ${filename} included from file ${meta.filename}: ${err.message}`;
      throw err;
    }
  }

}

ReplaceIncludesPlugin.defaults = {
  regex: /<%=\s*include\(\s*['"]([\s\S]+?)['"](?:\s*,\s*({[\s\S]+?})\s*)?\)\s*%>/gm,
  markdown: createDefaultMarkdownRenderer(),
  compileTemplate: _.template
};

export default ReplaceIncludesPlugin;
