import React from 'react';
import { StickyContainer, Sticky } from 'react-sticky';
import { connectToStores, provideContext } from 'fluxible-addons-react';
import TutorialStore from '../stores/TutorialStore';
import Breadcrumbs from './TutorialNavigator/Breadcrumbs';
import Tutorial from './TutorialNavigator/Tutorial';
import TutorialTableOfContents from './TutorialNavigator/TutorialTableOfContents';
import TutorialPrevNext from './TutorialNavigator/TutorialPrevNext';
import NavigationBar from './NavigationBar';
import Sidebar from './Sidebar';
import TryBanner from './TryBanner';
import IntroBanner from './IntroBanner';
import FeedbackFooter from './FeedbackFooter';
import TutorialNextSteps from './TutorialNavigator/TutorialNextSteps';
import initSampleBox from '../browser/sampleBox';
import ApplicationStore from '../stores/ApplicationStore';
import UserStore from '../stores/UserStore';

class TutorialPage extends React.Component {

  constructor(props) {
    super(props);

    // Transform quickstart object to pass as prop to Sidebar
    this.sidebarItems = Object
      .keys(props.quickstart.platforms).map(key => props.quickstart.platforms[key])
      .map((item) => Object.assign({}, item, { children: item.articles }));
  }

  componentDidMount() {
    this.initClient();
    initSampleBox();
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

  renderFooter() {
    const { isFramedMode, quickstart, platform, article } = this.props;
    let element;
    if (isFramedMode) {
      element = <TutorialNextSteps quickstart={quickstart} platform={platform} />;
    } else {
      element = <TutorialPrevNext quickstart={quickstart} platform={platform} currentArticle={article} />;
    }

    return <div data-swiftype-index="false">{element}</div>;
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

  renderFeedback() {
    const { quickstart, platform, article } = this.props;
    // TODO: This is temporary; we should switch to using the actual editUrl
    // from the doc's metadata once we are loading it.
    const editUrl = `https://github.com/auth0/docs/edit/master/articles/${quickstart.slug}/${platform.name}/${article.name}.md`;
    return (
      <div data-swiftype-index="false">
        <FeedbackFooter url={article.url} editUrl={editUrl} />
      </div>
    );
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

  render() {
    const { quickstart, platform, article, isFramedMode } = this.props;
    const columnWidth = isFramedMode ? 12 : 9;

    let tutorial;
    if (article) {
      tutorial = <Tutorial quickstart={quickstart} platform={platform} article={article} />;
    }

    return (
      <div className="docs-quickstart">
        <div id="tutorial-template" className="docs-single animated fadeIn">
          {this.renderNavigationBar()}
          <StickyContainer>
            <div className="js-doc-template container" style={{ marginBottom: '40px' }}>
              <div className="row">
                {this.renderSidebar()}
                <div className={`col-sm-${columnWidth}`}>
                  <div className="navigation" style={{ marginTop: '40px' }}>
                    <Breadcrumbs {...this.props} />
                  </div>
                  <section className="docs-content">
                    {this.renderIntroBanner()}
                    <article data-swiftype-index="true">
                      <h1 className="tutorial-title">{this.renderTitle()}</h1>
                      <div data-swiftype-name="body" data-swiftype-type="text">{tutorial}</div>
                      {this.renderFeedback()}
                      {this.renderFooter()}
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

TutorialPage = connectToStores(TutorialPage, [TutorialStore, ApplicationStore], (context, props) => {
  const appStore = context.getStore(ApplicationStore);
  const tutorialStore = context.getStore(TutorialStore);
  const userStore = context.getStore(UserStore);
  return {
    quickstart: tutorialStore.getCurrentQuickstart(),
    platform: tutorialStore.getCurrentPlatform(),
    article: tutorialStore.getCurrentArticle(),
    isFramedMode: appStore.isFramedMode(),
    isAuthenticated: userStore.isAuthenticated()
  };
});

export default TutorialPage;
