import React from 'react';
import { connectToStores } from 'fluxible-addons-react';
import DocumentStore from '../../stores/DocumentStore';
import highlightCode from '../../browser/highlightCode';
import setAnchorLinks from '../../browser/anchorLinks';
import Spinner from '../Spinner';

class Tutorial extends React.Component {

  initHtml(element) {
    // Execute any scripts that came with the article
    if (element && element.innerHTML) {
      highlightCode();
      setAnchorLinks();

      const dom = $(element.innerHTML);
      dom.filter('script').each(() => {
        $.globalEval(this.text || this.textContent || this.innerHTML || '');
      });
    }
  }

  render() {
    const { doc } = this.props;

    if (!doc || !doc.html) {
      return <Spinner />;
    }

    const markup = { __html: doc.html };
    return <div ref={this.initHtml} dangerouslySetInnerHTML={markup} />;
  }

}

Tutorial.propTypes = {
  article: React.PropTypes.object,
  doc: React.PropTypes.object
};

Tutorial = connectToStores(Tutorial, [DocumentStore], (context, props) => {
  const { article } = props;
  return {
    doc: context.getStore(DocumentStore).getDocument(article.url)
  };
});

export default Tutorial;
