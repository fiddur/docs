import _ from 'lodash';
import { createDefaultMarkdownRenderer } from '../../util';

class MarkdownPlugin {

  constructor(options = {}) {
    this.markdown = options.markdown || MarkdownPlugin.defaults.markdown;
  }

  transform(meta, content) {
    return this.markdown.render(content);
  }

}

MarkdownPlugin.defaults = {
  markdown: createDefaultMarkdownRenderer()
};

export default MarkdownPlugin;
