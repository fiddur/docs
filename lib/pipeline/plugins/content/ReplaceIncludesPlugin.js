import assert from 'assert';
import fs from 'fs';
import { dirname, extname, resolve } from 'path';
import vm from 'vm';
import { merge, template } from 'lodash';
import { createDefaultMarkdownRenderer } from '../../util';

class ReplaceIncludesPlugin {

  constructor(options = {}) {
    assert(options.snippetsDir, 'ReplaceIncludesPlugin constructor requires a snippetsDir option');
    this.snippetsDir = options.snippetsDir;
    this.regex = options.regex || ReplaceIncludesPlugin.defaults.regex;
    this.markdown = options.markdown || ReplaceIncludesPlugin.defaults.markdown;
    this.compileTemplate = options.compileTemplate || ReplaceIncludesPlugin.defaults.compileTemplate;
  }

  transform(doc, content) {
    const regex = new RegExp(this.regex);
    let match;
    let result = content;
    while (match = regex.exec(content)) { // eslint-disable-line no-cond-assign
      const [tag, code] = match;
      const include = this.extractInclude(doc, code);
      const rendered = this.renderInclude(include.filename, doc, include.vars);
      result = result.replace(tag, rendered);
      doc.addDependency(include.filename);
    }
    return result;
  }

  extractInclude(doc, code) {
    const resolveInclude = (dir, includeFilename) => {
      const base = resolve(dir, includeFilename);
      if (fs.existsSync(base)) return base;
      if (fs.existsSync(`${base}.md`)) return `${base}.md`;
      if (fs.existsSync(`${base}.html`)) return `${base}.html`;
      throw new Error(`Error resolving ${includeFilename} included from file ${doc.filename}`);
    };
    const result = {};
    const sandbox = merge({
      include: (path, vars) => {
        result.filename = resolveInclude(dirname(doc.filename), path);
        result.vars = vars || {};
      },
      snippet: (hash) => {
        result.filename = resolveInclude(this.snippetsDir, hash);
        result.vars = {};
      }
    }, doc);
    vm.runInNewContext(code, sandbox);
    return result;
  }

  renderInclude(filename, meta, localVars) {
    try {
      let content = fs.readFileSync(filename, 'utf8');
      if (extname(filename) === '.md') {
        content = this.markdown.render(content);
      }
      const func = this.compileTemplate(content);
      const context = merge({}, meta, localVars);
      return func(context);
    } catch (err) {
      err.message = `Error rendering ${filename} included from file ${meta.filename}: ${err.message}`;
      throw err;
    }
  }

}

ReplaceIncludesPlugin.defaults = {
  regex: /<%=\s*((?:include|snippet)\([\s\S]+?\))\s*%>/gm,
  markdown: createDefaultMarkdownRenderer(),
  compileTemplate: template
};

export default ReplaceIncludesPlugin;
