import _ from 'lodash';
import { createDefaultMarkdownRenderer } from '../../util';

class MarkdownPlugin {

  constructor(options = {}) {
    this.markdown = options.markdown || createDefaultMarkdownRenderer();
  }

  transform(meta, content) {
    return this.markdown.render(content);
  }

}

export default MarkdownPlugin;
