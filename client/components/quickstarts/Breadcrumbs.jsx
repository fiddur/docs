import React from 'react';
import _ from 'lodash';
import { connectToStores } from 'fluxible-addons-react';
import navigateToQuickstart from '../../action/navigateToQuickstart';
import ApplicationStore from '../../stores/ApplicationStore';
import QuickstartStore from '../../stores/QuickstartStore';

class Breadcrumbs extends React.Component {

  constructor() {
    super();
    this.handleClickHome = this.handleClickHome.bind(this);
    this.handleClickQuickstart = this.handleClickQuickstart.bind(this);
    this.handleClickPlatform = this.handleClickPlatform.bind(this);
    this.hanldeClickArticle = this.hanldeClickArticle.bind(this);
  }

  handleClickHome() {
    this.context.executeAction(navigateToQuickstart, {});
  }

  handleClickQuickstart() {
    this.context.executeAction(navigateToQuickstart, {
      quickstartId: this.props.quickstart.name
    });
  }

  handleClickPlatform() {
    this.context.executeAction(navigateToQuickstart, {
      quickstartId: this.props.quickstart.name,
      platformId: this.props.platform.name
    });
  }

  hanldeClickArticle() {
    this.context.executeAction(navigateToQuickstart, {
      quickstartId: this.props.quickstart.name,
      platformId: this.props.platform.name,
      articleId: this.props.article.name
    });
  }

  render() {
    const { quickstart, platform, article, isFramedMode, isSingleQuickstartMode } = this.props;

    if (!quickstart) {
      return <div />;
    }

    const crumbs = [];
    const addBreadcrumb = (text, onClick) => {
      crumbs.push(
        <li itemProp="itemListElement" itemScope itemType="http://schema.org/ListItem" key={crumbs.length + 1}>
          <a itemProp="item" onClick={onClick}>
            <span className="text" itemProp="name">{text}</span>
            <meta itemProp="position" content={crumbs.length + 1} />
          </a>
        </li>
      );
    };

    // Add a link to the homepage as long as we aren't restricted to a single app type.
    if (!isSingleQuickstartMode) {
      addBreadcrumb('Quickstarts', this.handleClickHome);
    }

    addBreadcrumb(quickstart.title, this.handleClickQuickstart);

    if (platform) {
      addBreadcrumb(platform.title, this.handleClickQuickstart);
      // Only add a link to the article if there are multiple articles for the platform,
      // and we aren't running in framed mode (which restricts us to a single article).
      if (article && platform.articles.length > 1 && !isFramedMode) {
        addBreadcrumb(article.title, this.handleClickArticle);
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

Breadcrumbs = connectToStores(Breadcrumbs, [ApplicationStore, QuickstartStore], (context, props) => {
  const appStore = context.getStore(ApplicationStore);
  const quickstartStore = context.getStore(QuickstartStore);
  return {
    quickstart: quickstartStore.getCurrentQuickstart(),
    platform: quickstartStore.getCurrentPlatform(),
    article: quickstartStore.getCurrentArticle(),
    isFramedMode: appStore.isFramedMode(),
    isSingleQuickstartMode: appStore.isSingleQuickstartMode()
  };
});

export default Breadcrumbs;
