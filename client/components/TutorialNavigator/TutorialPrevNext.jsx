import React from 'react';
import _ from 'lodash';
import loadArticleAction from '../../action/loadTutorialNavArticle';
import navigateAction from '../../action/navigateTutorial';

class TutorialPrevNext extends React.Component {

  handleClick(article) {
    let {quickstart, platform, customNavigationAction} = this.props;
    let payload = {
      quickstartId: quickstart.name,
      platformId: platform.name,
      articleId: article.name
    };
    if (customNavigationAction) {
      this.context.executeAction(customNavigationAction, payload);
    }
    else {
      Promise.all([
        this.context.executeAction(loadArticleAction, payload),
        this.context.executeAction(navigateAction, payload)
      ]);
    }
  }

  render() {

    let {platform, currentArticle} = this.props;
    let prev = undefined, next = undefined;

    if (currentArticle) {
      let currentIndex = currentArticle.number - 1;
      if (currentIndex > 0) {
        let prevArticle = platform.articles[currentIndex - 1];
        prev = (
          <div className="tutorial-prev-next-prev">
            <div className="tutorial-prev-next-header">Previous Tutorial</div>
            <a onClick={this.handleClick.bind(this, prevArticle)}>
              <i className="icon-budicon-463" /> {prevArticle.number}. {prevArticle.title}
            </a>
          </div>
        );
      }
      if (platform.articles.length > 1 && currentIndex < platform.articles.length - 1) {
        let nextArticle = platform.articles[currentIndex + 1];
        next = (
          <div className="tutorial-prev-next-next">
            <div className="tutorial-prev-next-header">Next Tutorial</div>
            <a onClick={this.handleClick.bind(this, nextArticle)}>
              {nextArticle.number}. {nextArticle.title} <i className="icon-budicon-461" />
            </a>
          </div>
        );
      }
    }

    return (
      <div className="tutorial-prev-next">
        {prev}
        {next}
      </div>
    );
  }

}

TutorialPrevNext.propTypes = {
  quickstart: React.PropTypes.object,
  platform: React.PropTypes.object,
  currentArticle: React.PropTypes.object,
  customNavigationAction: React.PropTypes.func
}

TutorialPrevNext.contextTypes = {
  executeAction: React.PropTypes.func
};

export default TutorialPrevNext;
