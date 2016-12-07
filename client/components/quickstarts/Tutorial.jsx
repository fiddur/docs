import React from 'react';
import { connectToStores } from 'fluxible-addons-react';
import DocumentStore from '../../stores/DocumentStore';
import QuickstartStore from '../../stores/QuickstartStore';
import getQuickstartDocumentUrl from '../../util/getQuickstartDocumentUrl';
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
  quickstart: React.PropTypes.object,
  platform: React.PropTypes.object,
  article: React.PropTypes.object,
  doc: React.PropTypes.object
};

Tutorial = connectToStores(Tutorial, [DocumentStore, QuickstartStore], (context, props) => {
  const { quickstart, platform, article } = props;
  const quickstarts = context.getStore(QuickstartStore).getQuickstarts();
  const url = getQuickstartDocumentUrl(quickstarts, {
    quickstartId: quickstart.name,
    platformId: platform.name,
    articleId: article.name
  });
  const doc =context.getStore(DocumentStore).getDocument(url);
  console.log({url, doc});
  return {
    doc
  };
});

export default Tutorial;
