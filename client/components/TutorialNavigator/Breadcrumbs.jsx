import React from 'react';
import _ from 'lodash';
import { connectToStores } from 'fluxible-addons-react';
import navigateAction from '../../action/navigateTutorial';
import ApplicationStore from '../../stores/ApplicationStore';
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
    this.context.executeAction(navigateAction, {});
  }

  handleClickQuickstart() {
    this.context.executeAction(navigateAction, {
      quickstartId: this.props.quickstart.name
    });
  }

  handleClickPlatform() {
    this.context.executeAction(navigateAction, {
      quickstartId: this.props.quickstart.name,
      platformId: this.props.platform.name
    });
  }

  hanldeClickArticle() {
    this.context.executeAction(navigateAction, {
      quickstartId: this.props.quickstart.name,
      platformId: this.props.platform.name,
      articleId: this.props.article.name
    });
  }

  render() {
    const crumbs = [];
    const { quickstart, platform, article, isFramedMode, isSingleQuickstartMode } = this.props;
    let index = 1;

    if (!quickstart) {
      return <div />;
    }

    // Don't display the top-level Documentation link if we're in single app type mode.
    if (isSingleQuickstartMode) {
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
      if (!isSingleQuickstartMode && article && platform.articles.length > 1) {
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
  isFramedMode: React.PropTypes.bool.isRequired,
  isSingleQuickstartMode: React.PropTypes.bool.isRequired
};

Breadcrumbs.contextTypes = {
  getStore: React.PropTypes.func,
  executeAction: React.PropTypes.func
};

Breadcrumbs = connectToStores(Breadcrumbs, [ApplicationStore, TutorialStore], (context, props) => {
  const appStore = context.getStore(ApplicationStore);
  const tutorialStore = context.getStore(TutorialStore);
  return {
    quickstart: tutorialStore.getCurrentQuickstart(),
    platform: tutorialStore.getCurrentPlatform(),
    article: tutorialStore.getCurrentArticle(),
    isFramedMode: appStore.isFramedMode(),
    isSingleQuickstartMode: appStore.isSingleQuickstartMode()
  };
});

export default Breadcrumbs;
