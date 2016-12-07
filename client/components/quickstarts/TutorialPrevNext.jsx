import React from 'react';
import _ from 'lodash';
import navigateToQuickstart from '../../action/navigateToQuickstart';

class TutorialPrevNext extends React.Component {

  handleClick(article) {
    const { quickstart, platform } = this.props;
    const payload = {
      quickstartId: quickstart.name,
      platformId: platform.name,
      articleId: article.name
    };
    this.context.executeAction(navigateToQuickstart, payload);
  }

  render() {
    const { platform, currentArticle } = this.props;
    let prev;
    let next;

    if (currentArticle) {
      const currentIndex = currentArticle.number - 1;
      if (currentIndex > 0) {
        const prevArticle = platform.articles[currentIndex - 1];
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
        const nextArticle = platform.articles[currentIndex + 1];
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
  currentArticle: React.PropTypes.object
};

TutorialPrevNext.contextTypes = {
  executeAction: React.PropTypes.func
};

export default TutorialPrevNext;
