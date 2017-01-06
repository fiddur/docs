import React from 'react';
import { StickyContainer, Sticky } from 'react-sticky';
import { connectToStores, provideContext } from 'fluxible-addons-react';
import { get } from 'lodash';
import ApplicationStore from '../../stores/ApplicationStore';
import QuickstartStore from '../../stores/QuickstartStore';
import UserStore from '../../stores/UserStore';
import { sendTutorialViewedEvent, sendPackageDownloadedEvent } from '../../browser/quickstartMetrics';
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

// Formats an array of names into an English list, like "X, Y, and Z".
const arrayToNameList = arr => arr.join(', ').replace(/,\s([^,]+)$/, ' and $1');

const shouldSendMetrics = (article, prevArticle = undefined) =>
  article && (!prevArticle || prevArticle.url !== article.url);

class TutorialPage extends React.Component {

  constructor(props) {
    super(props);
    this.communityDriven = get(this.props, 'platform.community');
  }

  componentDidMount() {
    this.initCommunityDriven();
    if (shouldSendMetrics(this.props.article)) this.handleMetrics();
    initSampleBox();
  }

  componentDidUpdate(prevProps) {
    this.initCommunityDriven();
    if (shouldSendMetrics(this.props.article, prevProps.article)) this.handleMetrics();
    initSampleBox();
  }

  initCommunityDriven() {
    this.communityDriven = get(this.props, 'platform.community');

    // Initialize any community maintained tooltip
    if (this.communityDriven) $('[data-toggle="tooltip"]').tooltip();
  }

  handleMetrics() {
    if (typeof document === 'undefined') return;
    sendTutorialViewedEvent(this.props);
    $('#package .btn').off('click').on('click', (e) => {
      sendPackageDownloadedEvent(this.props);
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

  renderCommunityMaintained(maintainers = []) {
    // Init tooltip only if maintainers option is defined
    const communityBoxOptions = get(this.props, 'platform.maintainers') ? {
      'data-html': 'true',
      'data-toggle': 'tooltip',
      'data-placement': 'right',
      title: `This tutorial is maintained by ${arrayToNameList(maintainers)} on Github.`
    } : {};

    return (
      <div className="community-maintained" {...communityBoxOptions}>
        <div className="icon" />
        <h5 className="title">Community maintained</h5>
      </div>
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

    const tutorialPageClasses = ['js-doc-template', 'tutorial-page', 'container'];
    if (this.communityDriven) tutorialPageClasses.push('community-driven-tutorial');

    return (
      <div className="docs-quickstart">
        <div id="tutorial-template" className="docs-single animated fadeIn">
          {this.renderNavigationBar()}
          <StickyContainer>
            <div className={tutorialPageClasses.join(' ')}>
              <div className="row">
                {this.renderSidebar()}
                <div className={`col-sm-${columnWidth}`}>
                  <Breadcrumbs {...this.props} />
                  <section className="docs-content">
                    {this.renderIntroBanner()}
                    <article data-swiftype-index="true">
                      <h1 className="tutorial-title">{this.renderTitle()}</h1>
                      { this.communityDriven && this.renderCommunityMaintained(this.props.platform.maintainers)}
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
  user: React.PropTypes.object,
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
    user: userStore.getUser(),
    isFramedMode: appStore.isFramedMode(),
    isAuthenticated: userStore.isAuthenticated()
  };
});

export default TutorialPage;
