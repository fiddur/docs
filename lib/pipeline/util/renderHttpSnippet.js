import fs from 'fs';
import path from 'path';
import _ from 'lodash';
import HTTPSnippet from 'httpsnippet';
import uuid from 'node-uuid';

const HTTP_TARGETS = [
  { key: 'shell', title: 'cURL', css: 'text' },
  { key: 'csharp', title: 'C#', css: 'csharp' },
  { key: 'go', title: 'Go', css: 'go' },
  { key: 'java', title: 'Java', css: 'java' },
  { key: 'javascript', type: 'jquery', title: 'jQuery', css: 'javascript' },
  { key: 'node', type: 'request', title: 'Node.JS', css: 'javascript' },
  { key: 'objc', title: 'Obj-C', css: 'objective-c' },
  { key: 'php', title: 'PHP', css: 'php', options: { noTags: true } },
  { key: 'python', title: 'Python', css: 'python' },
  { key: 'ruby', title: 'Ruby', css: 'ruby' },
  { key: 'swift', title: 'Swift', css: 'swift' }
];

const DEFAULT_TEMPLATE = _.template(fs.readFileSync(path.resolve(__dirname, 'httpSnippet.html')));

/**
 * Given a string of HAR code, this renders a code block that can be inserted into a document.
 * @param {String} string - The JSON blob of HAR code to process.
 * @param {Function} escapeHtml - A function that can escape HTML.
 * @param {Function} [template] - The template for the resulting snippet.
 */
export default function renderHttpSnippet(str, escapeHtml, template = DEFAULT_TEMPLATE) {
  let har;

  try {
    har = JSON.parse(str);
  } catch (err) {
    throw new Error('Invalid JSON in HAR snippet.');
  }

  if (!har) {
    throw new Error('Empty HAR value.');
  }

  try {
    const snippet = new HTTPSnippet(har);
    const snippets = [];
    HTTP_TARGETS.forEach(target => {
      let code = snippet.convert(target.key, target.type, target.options || {});
      code = code.replace(/https:\/\/\//g, 'https://'); // Some random encoding issue. ¯\_(ツ)_/¯
      code = escapeHtml(code);
      snippets.push({
        key: target.key,
        title: target.title,
        css: target.css,
        code
      });
    });
    return template({ id: uuid.v4().replace(/\-/g, ''), snippets });
  } catch (err) {
    err.message = `Error compiling HAR snippet: ${err.message}`;
    throw err;
  }
}
