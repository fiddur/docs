import React from 'react';
import { connectToStores } from 'fluxible-addons-react';
import ArticleStore from '../../stores/ArticleStore';
import highlightCode from '../../browser/highlightCode';
import setAnchorLinks from '../../browser/anchorLinks';

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
    let {articleHtml} = this.props;

    if (!articleHtml) {
      return <div className='loading-tutorial'>
        <div className='auth0-spinner'>
          <div className='spinner'></div>
        </div>
      </div>;
    }

    let markup = {__html: articleHtml};
    return <div ref={this.initHtml} dangerouslySetInnerHTML={markup} />;
  }

}

Tutorial.propTypes = {
  quickstart: React.PropTypes.object,
  platform: React.PropTypes.object,
  article: React.PropTypes.object,
  articleHtml: React.PropTypes.string
}

Tutorial = connectToStores(Tutorial, [ArticleStore], (context, props) => {
  let {quickstart, platform, article} = props;
  let store = context.getStore(ArticleStore);
  return {
    articleHtml: store.getArticleHtml(quickstart.name, platform.name, article.name)
  };
});

export default Tutorial;
