import React from 'react';
import _ from 'lodash';
import navigateAction from '../../action/navigateTutorial';
import TutorialStore from '../../stores/TutorialStore';
import { connectToStores } from 'fluxible-addons-react';

class Breadcrumbs extends React.Component {

  handleClick(params) {
    let payload = {};
    if (params.quickstart) payload.quickstartId = params.quickstart.name;
    if (params.platform)   payload.platformId   = params.platform.name;
    if (params.article)    payload.articleId    = params.article.name;
    this.context.executeAction(navigateAction, payload);
  }

  render() {
    let crumbs = [];
    let {quickstart, platform, article, isRestricted, isSingleArticleMode} = this.props;
    let index = 1;

    if (!quickstart) {
      return <div />;
    }

    // If we're running in "restricted" mode (eg. in the management site),
    // we're locked into a specific appType, and we don't want to display the
    // top-level Documentation link.
    if (isRestricted) {
      crumbs.push(
        <li itemProp="itemListElement" itemScope itemType="http://schema.org/ListItem" key={index}>
          <a itemProp="item" key="quickstart" onClick={this.handleClick.bind(this, {quickstart})}>
            <span className="text" itemProp="name">{quickstart.title}</span>
            <meta itemProp="position" content={index} />
          </a>
        </li>
      );
      index++;
    }
    else {
      crumbs.push(
        <li itemProp="itemListElement" itemScope itemType="http://schema.org/ListItem" key={index}>
          <a itemProp="item" key="base" onClick={this.handleClick.bind(this, {})}>
            <span className="text" itemProp="name">Quickstarts</span>
            <meta itemProp="position" content={index} />
          </a>
        </li>
      );
      index++;
      crumbs.push(
        <li itemProp="itemListElement" itemScope itemType="http://schema.org/ListItem" key={index}>
          <a itemProp="item" key="quickstart" onClick={this.handleClick.bind(this, {quickstart})}>
            <span className="text" itemProp="name">{quickstart.title}</span>
            <meta itemProp="position" content={index} />
          </a>
        </li>
      );
      index++;
    }

    if (platform) {
      crumbs.push(
        <li itemProp="itemListElement" itemScope itemType="http://schema.org/ListItem" key={index}>
          <a itemProp="item" key="platform" onClick={this.handleClick.bind(this, {quickstart, platform})}>
            <span className="text" itemProp="name">{platform.title}</span>
            <meta itemProp="position" content={index} />
          </a>
        </li>
      );
      index++;
      if (article && platform.articles.length > 1 && !isSingleArticleMode) {
        crumbs.push(
          <li itemProp="itemListElement" itemScope itemType="http://schema.org/ListItem" key={index}>
            <a itemProp="item" key="article" onClick={this.handleClick.bind(this, {quickstart, platform, article})}>
              <span className="text" itemProp="name">{article.title}</span>
              <meta itemProp="position" content={index} />
            </a>
          </li>
        );
        index++;
      }
    }

    return <ul className="breadcrumb" itemScope itemType="http://schema.org/BreadcrumbList">{crumbs}</ul>;
  }

}

Breadcrumbs.propTypes = {
  quickstart: React.PropTypes.object,
  platform: React.PropTypes.object,
  article: React.PropTypes.object,
  isRestricted: React.PropTypes.bool
}

Breadcrumbs.contextTypes = {
  getStore: React.PropTypes.func,
  executeAction: React.PropTypes.func,
};

Breadcrumbs = connectToStores(Breadcrumbs, [TutorialStore], (context, props) => {
  let store = context.getStore(TutorialStore);
  return {
    quickstart: store.getCurrentQuickstart(),
    platform: store.getCurrentPlatform(),
    article: store.getCurrentArticle(),
    isRestricted: store.getRestricted(),
    isSingleArticleMode: store.getSingleArticleMode()
  };
});

export default Breadcrumbs;
