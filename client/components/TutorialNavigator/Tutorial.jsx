import React from 'react';
import { connectToStores } from 'fluxible-addons-react';
import ArticleStore from '../../stores/ArticleStore';

class Tutorial extends React.Component {

  componentDidMount () {
    this.initClient();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.articleHtml !== this.props.articleHtml) {
      this.initClient();
    }
  }

  initClient() {
    if (this.props.componentLoadedInBrowser && typeof window !== 'undefined') {
      this.props.componentLoadedInBrowser.call(this);
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
    return <div ref="article" dangerouslySetInnerHTML={markup} />;
  }

}

Tutorial.propTypes = {
  quickstart: React.PropTypes.object,
  platform: React.PropTypes.object,
  article: React.PropTypes.object,
  articleHtml: React.PropTypes.string,
  componentLoadedInBrowser: React.PropTypes.func
}

Tutorial = connectToStores(Tutorial, [ArticleStore], (context, props) => {
  let {quickstart, platform, article} = props;
  let store = context.getStore(ArticleStore);
  return {
    articleHtml: store.getArticleHtml(quickstart.name, platform.name, article.name)
  };
});

export default Tutorial;
