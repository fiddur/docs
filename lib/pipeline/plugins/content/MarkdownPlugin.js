import _ from 'lodash';
import { parseMarkdown } from '../../util';

class MarkdownPlugin {

  constructor(options = {}) {
    this.parseMarkdown = options.parseMarkdown || MarkdownPlugin.defaults.parseMarkdown;
  }

  transform(doc, content) {
    if (doc.extension === '.md') return this.parseMarkdown(content);
    return content;
  }

}

MarkdownPlugin.defaults = {
  parseMarkdown
};

export default MarkdownPlugin;
