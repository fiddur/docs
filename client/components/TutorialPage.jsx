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
import initSampleBox from '../browser/sampleBox';
import ApplicationStore from '../stores/ApplicationStore';

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

  render() {

    const { quickstart, platform, article, isAuthenticated } = this.props;
    const tryBanner = isAuthenticated ? null : <TryBanner />;
    const sidebarTitle = platform ? platform.title : '';
    const sidebarItems = platform ? platform.articles : [];

    let tutorial;
    let sidebar;
    let prevNext;
    let feedbackFooter;

    if (article) {
      tutorial = (<Tutorial
        quickstart={quickstart}
        platform={platform}
        article={article}
      />);
      prevNext = (<TutorialPrevNext
        quickstart={quickstart}
        platform={platform}
        currentArticle={article}
      />);
      // TODO: This is temporary; we should switch to using the actual editUrl
      // from the doc's metadata once we are loading it.
      const editUrl = `https://github.com/auth0/docs/edit/master/articles/${quickstart.slug}/${platform.name}/${article.name}.md`;
      feedbackFooter = <FeedbackFooter url={article.url} editUrl={editUrl} />;
    }

    return (
      <div className="docs-quickstart">
        <div id="tutorial-template" className="docs-single animated fadeIn">
          <NavigationBar currentSection="quickstarts" />
          <StickyContainer>
            <div className="js-doc-template container" style={{ marginBottom: '40px' }}>
              <div className="row">
                <div className="sidebar-container col-md-3">
                  <Sidebar
                    section={sidebarTitle} maxDepth={3} includeSectionInBreadcrumb isQuickstart
                    items={sidebarItems} url={this.props.currentRoute.url}
                  />
                </div>
                <div className="col-md-9">
                  <div className="navigation" style={{ marginTop: '40px' }}>
                    <Breadcrumbs {...this.props} />
                  </div>
                  <section className="docs-content">
                    <IntroBanner />
                    <article data-swiftype-index="true">
                      <h1 className="tutorial-title">{this.renderTitle()}</h1>
                      <div data-swiftype-name="body" data-swiftype-type="text">{tutorial}</div>
                      <div data-swiftype-index="false">{prevNext}</div>
                      <div data-swiftype-index="false">{feedbackFooter}</div>
                    </article>
                  </section>
                  {tryBanner}
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
  article: React.PropTypes.object
};

TutorialPage.contextTypes = {
  getStore: React.PropTypes.func,
  executeAction: React.PropTypes.func,
  trackEvent: React.PropTypes.func.isRequired
};

TutorialPage = connectToStores(TutorialPage, [TutorialStore, ApplicationStore], (context, props) => {
  const tutorialStore = context.getStore(TutorialStore);
  const appStore = context.getStore(ApplicationStore);
  return {
    quickstart: tutorialStore.getCurrentQuickstart(),
    platform: tutorialStore.getCurrentPlatform(),
    article: tutorialStore.getCurrentArticle(),
    user: appStore.getUser()
  };
});

export default TutorialPage;
