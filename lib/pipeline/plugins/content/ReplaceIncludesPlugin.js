import assert from 'assert';
import fs from 'fs';
import { dirname, extname, resolve } from 'path';
import vm from 'vm';
import { merge, template } from 'lodash';
import { parseMarkdown, unescapeHtml } from '../../util';

class ReplaceIncludesPlugin {

  constructor(options = {}) {
    assert(options.snippetsDir, 'ReplaceIncludesPlugin constructor requires a snippetsDir option');
    this.snippetsDir = options.snippetsDir;
    this.matchRegex = options.matchRegex || ReplaceIncludesPlugin.defaults.matchRegex;
    this.argumentRegex = options.argumentRegex || ReplaceIncludesPlugin.defaults.argumentRegex;
    this.parseMarkdown = options.parseMarkdown || ReplaceIncludesPlugin.defaults.parseMarkdown;
  }

  transform(doc, content) {
    return this.process(doc, doc.filename, content);
  }

  process(doc, parentFilename, parentContent) {
    const regex = new RegExp(this.matchRegex);
    return parentContent.replace(regex, (match, type, body) => {
      const { filename, vars } = this.interpret(doc, parentFilename, type, body);
      doc.addDependency(filename);
      let content = fs.readFileSync(filename, 'utf8');
      if (extname(filename) === '.md') content = this.parseMarkdown(content);
      content = this.process(doc, filename, content);
      content = `<%
      try { %>${content}<% }
      catch(err) {
        err.message = 'While rendering include ${filename}: ' + err.message;
        throw err;
      } %>`;
      if (vars) {
        content = `<% with(${vars}) { %>${content}<% } %>`;
      }
      return content;
    });
  }

  interpret(doc, parentFilename, type, body) {
    if (type === 'snippet') {
      return this.interpretSnippet(doc, parentFilename, body);
    }
    return this.interpretInclude(doc, parentFilename, body);
  }

  interpretInclude(doc, parentFilename, body) {
    const [match, path, vars] = body.match(this.argumentRegex);
    const filename = this.resolveFilename(dirname(parentFilename), path);
    if (!filename) {
      throw new Error(`Couldn't resolve include ${path} included from file ${parentFilename}`);
    }
    return { filename, vars };
  }

  interpretSnippet(doc, parentFilename, body) {
    let path;
    try {
      path = template(`<%= ${body} %>`)({ doc, meta: doc.meta });
    } catch (err) {
      err.message = `Interpreting argument ${body} to snippet() in ${parentFilename}: ${err.message}`;
      throw err;
    }
    const filename = this.resolveFilename(this.snippetsDir, path);
    if (!filename) {
      throw new Error(`Couldn't resolve snippet ${path} included from file ${parentFilename}`);
    }
    return { filename };
  }

  resolveFilename(dir, path) {
    const base = resolve(dir, path);
    if (fs.existsSync(base)) return base;
    if (fs.existsSync(`${base}.md`)) return `${base}.md`;
    if (fs.existsSync(`${base}.html`)) return `${base}.html`;
    return undefined;
  }

}

ReplaceIncludesPlugin.defaults = {
  matchRegex: /(?:<%=|\$\{)\s*(include|snippet)\(\s*([\s\S]+?)\s*\)\s*(?:%>|\})/gm,
  argumentRegex: /['"]([\s\S]+?)['"](?:\s*,\s*({[\s\S]+?})\s*)?/m,
  parseMarkdown
};

export default ReplaceIncludesPlugin;
