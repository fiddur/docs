import React from 'react';
import _ from 'lodash';
import { connectToStores } from 'fluxible-addons-react';
import navigateAction from '../../action/navigateTutorial';
import TutorialStore from '../../stores/TutorialStore';


class Breadcrumbs extends React.Component {

  constructor() {
    super();
    this.handleClickHome = this.handleClickHome.bind(this);
    this.handleClickQuickstart = this.handleClickQuickstart.bind(this);
    this.handleClickPlatform = this.handleClickPlatform.bind(this);
    this.hanldeClickArticle = this.hanldeClickArticle.bind(this);
  }

  handleClickHome() {
    this.context.executeAction(navigateAction, {
      isFramedMode: this.props.isFramedMode
    });
  }

  handleClickQuickstart() {
    this.context.executeAction(navigateAction, {
      isFramedMode: this.props.isFramedMode,
      quickstartId: this.props.quickstart.name
    });
  }

  handleClickPlatform() {
    this.context.executeAction(navigateAction, {
      isFramedMode: this.props.isFramedMode,
      quickstartId: this.props.quickstart.name,
      platformId: this.props.platform.name
    });
  }

  hanldeClickArticle() {
    this.context.executeAction(navigateAction, {
      isFramedMode: this.props.isFramedMode,
      quickstartId: this.props.quickstart.name,
      platformId: this.props.platform.name,
      articleId: this.props.article.name
    });
  }

  render() {
    const crumbs = [];
    const { quickstart, platform, article, isRestricted, isSingleArticleMode } = this.props;
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
          <a itemProp="item" key="quickstart" onClick={this.handleClickQuickstart}>
            <span className="text" itemProp="name">{quickstart.title}</span>
            <meta itemProp="position" content={index} />
          </a>
        </li>
      );
      index++;
    } else {
      crumbs.push(
        <li itemProp="itemListElement" itemScope itemType="http://schema.org/ListItem" key={index}>
          <a itemProp="item" key="base" onClick={this.handleClickHome}>
            <span className="text" itemProp="name">Quickstarts</span>
            <meta itemProp="position" content={index} />
          </a>
        </li>
      );
      index++;
      crumbs.push(
        <li itemProp="itemListElement" itemScope itemType="http://schema.org/ListItem" key={index}>
          <a itemProp="item" key="quickstart" onClick={this.handleClickQuickstart}>
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
          <a
            itemProp="item" key="platform"
            onClick={this.handleClickPlatform}
          >
            <span className="text" itemProp="name">{platform.title}</span>
            <meta itemProp="position" content={index} />
          </a>
        </li>
      );
      index++;
      if (article && platform.articles.length > 1 && !isSingleArticleMode) {
        crumbs.push(
          <li itemProp="itemListElement" itemScope itemType="http://schema.org/ListItem" key={index}>
            <a
              itemProp="item"
              key="article"
              onClick={this.handleClickArticle}
            >
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
  isRestricted: React.PropTypes.bool,
  isFramedMode: React.PropTypes.bool.isRequired,
  isSingleArticleMode: React.PropTypes.bool
};

Breadcrumbs.contextTypes = {
  getStore: React.PropTypes.func,
  executeAction: React.PropTypes.func
};

Breadcrumbs = connectToStores(Breadcrumbs, [TutorialStore], (context, props) => {
  const store = context.getStore(TutorialStore);
  return {
    quickstart: store.getCurrentQuickstart(),
    platform: store.getCurrentPlatform(),
    article: store.getCurrentArticle(),
    isRestricted: store.getRestricted(),
    isSingleArticleMode: store.getSingleArticleMode()
  };
});

export default Breadcrumbs;
