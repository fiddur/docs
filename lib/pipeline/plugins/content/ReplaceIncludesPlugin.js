import assert from 'assert';
import fs from 'fs';
import { dirname, extname, resolve } from 'path';
import vm from 'vm';
import { merge, template } from 'lodash';
import { parseMarkdown, unescapeHtml } from '../../util';

/**
 * Finds calls to include() and snippet() within document content and replaces them
 * with the rendered content of the requested include file or snippet.
 */
class ReplaceIncludesPlugin {

  /**
   * Creates an instance of ReplaceIncludesPlugin.
   * @param {Object} options - An options hash.
   * @param {String} options.snippetsDir - The absolute path containing snippet files.
   * @param {RegExp} [options.matchRegex] - The regex to use to find function calls.
   * @param {RegExp} [options.argumentRegex] - The regex to use to extract function arguments.
   * @param {Function} [options.parseMarkdown] - A function used parse Markdown content in includes.
   */
  constructor(options = {}) {
    assert(options.snippetsDir, 'ReplaceIncludesPlugin constructor requires a snippetsDir option');
    this.snippetsDir = options.snippetsDir;
    this.matchRegex = options.matchRegex || ReplaceIncludesPlugin.defaults.matchRegex;
    this.argumentRegex = options.argumentRegex || ReplaceIncludesPlugin.defaults.argumentRegex;
    this.parseMarkdown = options.parseMarkdown || ReplaceIncludesPlugin.defaults.parseMarkdown;
  }

  /**
   * Transforms the specified content, replacing any calls to include() or snippet() with the
   * associated rendered content. If the included file also makes a call to include() or snippet(),
   * it will be resolved recursively (and so on).
   * @param {Document} doc - The document being processed.
   * @param {String} content - The current content for the document.
   * @returns {String} The (potentially-transformed) content for the document.
   */
  preprocess(doc, content) {
    return this.handleFile(doc, doc.filename, content);
  }

  /**
   * Processes the specified content for the specified filename.
   * @param {Document} doc - The document being processed.
   * @param {String} parentFilename - The file whose content is being processed.
   * @param {String} parentContent - The content of the current file.
   * @returns {String} The transformed content for the specified file.
   * @private
   */
  handleFile(doc, parentFilename, parentContent) {
    const regex = new RegExp(this.matchRegex);
    return parentContent.replace(regex, (match, type, body) => {
      const { filename, vars } = this.interpret(doc, parentFilename, type, body);
      doc.addDependency(filename);
      let content = fs.readFileSync(filename, 'utf8');
      if (extname(filename) === '.md') content = this.parseMarkdown(content);
      content = this.handleFile(doc, filename, content);
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

  /**
   * Interprets a matched call to include() or snippet().
   * @param {Document} doc - The document being processed.
   * @param {String} parentFilename - The file whose content is being processed.
   * @param {String} type - The name of the function that was called.
   * @param {String} body - The body of the function call.
   * @returns {Object} An object representing the include.
   * @private
   */
  interpret(doc, parentFilename, type, body) {
    if (type === 'snippet') {
      return this.interpretSnippet(doc, parentFilename, body);
    }
    return this.interpretInclude(doc, parentFilename, body);
  }

  /**
   * Interprets a matched call to include().
   * @param {Document} doc - The document being processed.
   * @param {String} parentFilename - The file whose content is being processed.
   * @param {String} body - The body of the function call.
   * @returns {Object} An object representing the include.
   * @private
   */
  interpretInclude(doc, parentFilename, body) {
    const [match, path, vars] = body.match(this.argumentRegex);
    const filename = this.resolveFilename(dirname(parentFilename), path);
    if (!filename) {
      throw new Error(`Couldn't resolve include ${path} included from file ${parentFilename}`);
    }
    return { filename, vars };
  }

  /**
   * Interprets a matched call to snippet().
   * @param {Document} doc - The document being processed.
   * @param {String} parentFilename - The file whose content is being processed.
   * @param {String} body - The body of the function call.
   * @returns {Object} An object representing the include.
   * @private
   */
  interpretSnippet(doc, parentFilename, body) {
    let path;
    try {
      path = template(`<%= ${body} %>`)({ meta: doc });
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

  /**
   * Resolves the filename of an included file, relative to the specified directory,
   * ensuring that the file exists. If the specified path doesn't include an extension,
   * it will check for the existence of files at <path>.md and <path>.html.
   * @param {String} dir - The directory from which to resolve the path.
   * @param {String} path - The (possibly extensionless) relative path to resolve.
   * @returns {String} The absolute filename of an existing file, or undefined if none was found.
   */
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
