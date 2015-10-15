import React from 'react';
import TutorialArticleStore from '../stores/TutorialArticleStore';

class Tutorial extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = this.getStoreState();
  }
  getStoreState () {
    return {
      articleHtml: this.context.getStore(TutorialArticleStore).getArticle(this.props.appType, this.props.tech)
    }
  }
  componentDidMount () {
    this.context
      .getStore(TutorialArticleStore)
      .addChangeListener(this._onStoreChange.bind(this));

    if (document !== undefined) {
      var el = document.getElementById('homepage-content');
      el.classList.add('hide');
    }
  }
  componentWillUnmount () {
    this.context
      .getStore(TutorialArticleStore)
      .removeChangeListener(this._onStoreChange.bind(this));
  }
  _onStoreChange () {
    this.setState(this.getStoreState());
  }
  createMarkup() {
    return {__html: this.state.articleHtml};
  }
  render() {
    if (this.state.articleHtml) {
      return (
        <div id={this.props.tabName}
             className={'tab-pane' + (this.props.default ? ' active' : '')}
             dangerouslySetInnerHTML={this.createMarkup()} />
      );
    } else {
      return (
        <div className='loading-tutorial'>
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

export default Tutorial;
