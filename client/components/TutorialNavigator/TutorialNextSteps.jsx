import React from 'react';
import _ from 'lodash';
import TutorialStore from '../../stores/TutorialStore';

const DEFAULT_ARTICLE_BUDICON = 691;

class TutorialNextSteps extends React.Component {

  getArticleUrl(quickstart, platform, article) {
    const baseUrl = (typeof window === 'undefined') ? '/docs' : window.env.DOMAIN_URL_DOCS;
    return [
      baseUrl,
      'quickstart',
      quickstart.name,
      platform.name,
      article.name
    ].join('/');
  }

  render() {
    const { quickstart, platform } = this.props;

    if (!quickstart || !platform) return <div />;

    const items = platform.articles.map((article, index) => {
      const icon = article.budicon ? article.budicon : DEFAULT_ARTICLE_BUDICON;
      const href = this.getArticleUrl(quickstart, platform, article);
      return (
        <li key={index} className="tutorial-next-steps-article">
          <a href={href} target="_blank" rel="noopener noreferrer">
            <i className={`icon icon-budicon-${icon}`} />
            {article.title}
          </a>
        </li>
      );
    });

    return (
      <div className="tutorial-next-steps">
        <h2>What can you do next?</h2>
        <p>Check our tutorials to learn more about using Auth0 in your {platform.title} apps.</p>
        <ul className="tutorial-next-steps-articles">
          {items}
        </ul>
      </div>
    );
  }

}

TutorialNextSteps.propTypes = {
  quickstart: React.PropTypes.object,
  platform: React.PropTypes.object
}

export default TutorialNextSteps;
