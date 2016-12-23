import React from 'react';
import { StickyContainer, Sticky } from 'react-sticky';
import { connectToStores, provideContext } from 'fluxible-addons-react';
import { get } from 'lodash';
import ApplicationStore from '../../stores/ApplicationStore';
import QuickstartStore from '../../stores/QuickstartStore';
import UserStore from '../../stores/UserStore';
import initSampleBox from '../../browser/sampleBox';
import NavigationBar from '../NavigationBar';
import Sidebar from '../Sidebar';
import TryBanner from '../TryBanner';
import IntroBanner from '../IntroBanner';
import FeedbackFooter from '../FeedbackFooter';
import Breadcrumbs from '../quickstarts/Breadcrumbs';
import Tutorial from '../quickstarts/Tutorial';
import TutorialTableOfContents from '../quickstarts/TutorialTableOfContents';
import TutorialPrevNext from '../quickstarts/TutorialPrevNext';
import TutorialNextSteps from '../quickstarts/TutorialNextSteps';

class TutorialPage extends React.Component {

  componentDidMount() {
    this.initClient();
    initSampleBox();

    // Initialize any community maintained tooltip
    $('[data-toggle="tooltip"]').tooltip();
  }

  componentDidUpdate() {
    this.initClient();
    initSampleBox();
  }

  initClient() {
    if (typeof document !== 'undefined') {
      this.metrics();
    }
  }

  metrics() {
    const { quickstart, platform } = this.props;
    const eventData = {
      'tutorial-apptype': quickstart ? quickstart.name : '',
      'tutorial-platform': platform ? platform.name : ''
    };
    $('#package .btn').off('click').on('click', (e) => {
      if (e.currentTarget && e.currentTarget.href) {
        const url = e.currentTarget.href;
        const urlClientID = url.match(/client_id=([^&]*)/);
        eventData.clientID = urlClientID && urlClientID[1]
          ? urlClientID[1]
          : '';
      }
      this.context.trackEvent('download:tutorial-seed', eventData);
    });
  }

  renderTitle() {
    const { platform, article } = this.props;
    if (!platform || !article) return '';
    if (platform.articles.length === 1) return platform.title;
    return `${platform.title} ${article.title}`;
  }

  renderBottomNavigation() {
    const { isFramedMode, quickstart, platform, article } = this.props;
    let element;
    if (isFramedMode) return <TutorialNextSteps quickstart={quickstart} platform={platform} />;
    return (
      <TutorialPrevNext quickstart={quickstart} platform={platform} currentArticle={article} />
    );
  }

  renderTryBanner() {
    const { isAuthenticated, isFramedMode } = this.props;
    if (isAuthenticated || isFramedMode) return undefined;
    return <TryBanner />;
  }

  renderIntroBanner() {
    const { isFramedMode } = this.props;
    if (isFramedMode) return undefined;
    return <IntroBanner />;
  }

  renderSidebar() {
    const { isFramedMode, platform } = this.props;

    if (isFramedMode) return undefined;

    const sidebarTitle = platform ? platform.title : '';
    const sidebarItems = platform ? platform.articles : [];

    return (
      <div className="sidebar-container col-md-3">
        <Sidebar
          section={sidebarTitle} maxDepth={3} includeSectionInBreadcrumb isQuickstart
          items={sidebarItems} url={this.props.currentRoute.url}
        />
      </div>
    );
  }

  renderNavigationBar() {
    const { isFramedMode } = this.props;
    if (isFramedMode) return undefined;
    return <NavigationBar currentSection="quickstarts" />;
  }

  renderCommunityMaintained() {
    return (
      <button
        className="community-maintained"
        type="button"
        data-html="true"
        data-toggle="tooltip"
        data-placement="top"
        title="This tutorial is maintained by @user in Github."
      >
        <h5 className="title">Community maintained</h5>
        <svg className="icon" fill="#222" height="22" viewBox="0 0 24 24" width="22" xmlns="http://www.w3.org/2000/svg">
          <path
            d={
              `M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3
              1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99
              4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z`
            }
          />
          <path d="M0 0h24v24H0z" fill="none" />
        </svg>
      </button>
    );
  }

  render() {
    const { quickstart, platform, article, isFramedMode } = this.props;
    const columnWidth = isFramedMode ? 12 : 9;

    let tutorial;
    let feedbackFooter;

    if (article) {
      tutorial = <Tutorial quickstart={quickstart} platform={platform} article={article} />;
      const editUrl = `https://github.com/auth0/docs/edit/master/articles/${quickstart.slug}/${platform.name}/${article.name}.md`;
      feedbackFooter = (
        <div data-swiftype-index="false">
          <FeedbackFooter url={article.url} editUrl={editUrl} />
        </div>
      );
    }

    return (
      <div className="docs-quickstart">
        <div id="tutorial-template" className="docs-single animated fadeIn">
          {this.renderNavigationBar()}
          <StickyContainer>
            <div className="js-doc-template tutorial-page container">
              <div className="row">
                {this.renderSidebar()}
                <div className={`col-sm-${columnWidth}`}>
                  <Breadcrumbs {...this.props} />
                  <section className="docs-content">
                    {this.renderIntroBanner()}
                    <article data-swiftype-index="true">
                      <h1 className="tutorial-title">{this.renderTitle()}</h1>
                      { get(this.props, 'platform.community') && this.renderCommunityMaintained() }
                      <div data-swiftype-name="body" data-swiftype-type="text">{tutorial}</div>
                      <div data-swiftype-index="false">{this.renderBottomNavigation()}</div>
                      <div data-swiftype-index="false">{feedbackFooter}</div>
                    </article>
                  </section>
                  {this.renderTryBanner()}
                </div>
              </div>
            </div>
          </StickyContainer>
        </div>
      </div>
    );
  }

}

TutorialPage.propTypes = {
  quickstart: React.PropTypes.object,
  platform: React.PropTypes.object,
  article: React.PropTypes.object,
  isAuthenticated: React.PropTypes.bool,
  currentRoute: React.PropTypes.object.isRequired,
  isFramedMode: React.PropTypes.bool.isRequired
};

TutorialPage.contextTypes = {
  getStore: React.PropTypes.func,
  executeAction: React.PropTypes.func,
  trackEvent: React.PropTypes.func.isRequired
};

TutorialPage = connectToStores(TutorialPage, [ApplicationStore, QuickstartStore], (context, props) => {
  const appStore = context.getStore(ApplicationStore);
  const quickstartStore = context.getStore(QuickstartStore);
  const userStore = context.getStore(UserStore);
  return {
    quickstart: quickstartStore.getCurrentQuickstart(),
    platform: quickstartStore.getCurrentPlatform(),
    article: quickstartStore.getCurrentArticle(),
    isFramedMode: appStore.isFramedMode(),
    isAuthenticated: userStore.isAuthenticated()
  };
});

export default TutorialPage;
