import React from 'react';
import TutorialArticleStore from '../stores/TutorialArticleStore';
import { connectToStores, provideContext } from 'fluxible-addons-react';

class Tutorial extends React.Component {
  componentDidMount () {
    this.updateClient();
  }
  componentDidUpdate() {
    this.updateClient();
  }
  updateClient(html) {
    if (typeof document !== 'undefined') {
      Auth0Docs.renderCode();
      var child = this.refs.article.firstChild;
      if (child.nodeName === 'H2') {
        child.classList.add('hide');
      }
    }
  }
  createMarkup() {
    return {__html: this.props.articleHtml};
  }
  render() {
    if (this.props.articleHtml) {
      return (
        <div id={this.props.tabName}
          className={'tab-pane' + (this.props.default ? ' active' : '')}
          dangerouslySetInnerHTML={this.createMarkup()}
          ref="article" />
      );
    } else {
      return (
          <div id={this.props.tabName} className='loading-tutorial'>
            <div className='auth0-spinner'>
              <div className='spinner'></div>
            </div>
          </div>
      );
    }
  }
}

Tutorial.contextTypes = {
  getStore: React.PropTypes.func,
  executeAction: React.PropTypes.func
};

Tutorial = connectToStores(Tutorial, [TutorialArticleStore], (context, props) => ({
  articleHtml: context.getStore(TutorialArticleStore).getArticleHtml(props.appType, props.tech)
}));

export default Tutorial;
