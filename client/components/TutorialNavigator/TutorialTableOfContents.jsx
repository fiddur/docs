import React from 'react';
import _ from 'lodash';
import loadTutorial from '../../action/loadTutorial';
import navigateToQuickstart from '../../action/navigateToQuickstart';

class TutorialTableOfContents extends React.Component {

  handleClick(article, isFirst) {
    const { quickstart, platform } = this.props;
    const payload = {
      quickstartId: quickstart.name,
      platformId: platform.name
    };
    if (!isFirst) {
      payload.articleId = article.name;
    }
    this.context.executeAction(navigateToQuickstart, payload);
  }

  render() {
    const { platform, currentArticle } = this.props;

    const items = platform.articles.map((article, index) => {
      const selected = (article.name === currentArticle.name) ? 'selected ' : '';
      const isFirst = (index === 0);
      const onClick = this.handleClick.bind(this, article, isFirst);
      return (
        <li key={index} className={`${selected} tutorial-toc-article`} onClick={onClick}>
          {article.title}
        </li>
      );
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
