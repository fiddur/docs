import React from 'react';
import TutorialArticleStore from '../stores/TutorialArticleStore';
import { connectToStores, provideContext } from 'fluxible-addons-react';

class Tutorial extends React.Component {
  componentDidMount () {
    this.highlightCode();
  }
  componentDidUpdate() {
    this.highlightCode();
  }
  highlightCode(html) {
    if (typeof document !== 'undefined') {
      Auth0Docs.renderCode();
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
          dangerouslySetInnerHTML={this.createMarkup()} />
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
