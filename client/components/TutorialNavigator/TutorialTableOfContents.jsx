import React from 'react';
import _ from 'lodash';
import loadArticleAction from '../../action/loadTutorialNavArticle';
import navigateAction from '../../action/navigateTutorial';

class TutorialTableOfContents extends React.Component {

  handleClick(article, isFirst) {
    let {quickstart, platform } = this.props;
    let payload = {
      quickstartId: quickstart.name,
      platformId: platform.name
    };
    if (!isFirst) {
      payload.articleId = article.name;
    }
    this.context.executeAction(navigateAction, payload);
  }

  render() {
    let {platform, currentArticle} = this.props;

    let items = platform.articles.map((article, index) => {
      let selected = (article.name == currentArticle.name) ? 'selected ' : '';
      let isFirst = (index == 0);
      return <li key={index} className={selected + "tutorial-toc-article"} onClick={this.handleClick.bind(this, article, isFirst)}>
        {article.title}
      </li>
    });

    return (
      <div className="tutorial-toc">
        <div className="tutorial-toc-header">
          <div className="tutorial-toc-title">{platform.title} Tutorials</div>
          <div className="tutorial-toc-description">{platform.description}</div>
        </div>
        <ul className="tutorial-toc-articles">
          {items}
        </ul>
      </div>
    );
  }

}

TutorialTableOfContents.propTypes = {
  quickstart: React.PropTypes.object,
  platform: React.PropTypes.object,
  currentArticle: React.PropTypes.object
}

TutorialTableOfContents.contextTypes = {
  executeAction: React.PropTypes.func
};

export default TutorialTableOfContents;
