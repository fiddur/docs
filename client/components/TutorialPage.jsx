import React from 'react';
import { StickyContainer, Sticky } from 'react-sticky';
import { connectToStores, provideContext } from 'fluxible-addons-react';
import { TutorialStore, Breadcrumbs, Tutorial, TutorialTableOfContents, TutorialPrevNext } from 'auth0-tutorial-navigator';
import NavigationBar from './NavigationBar';
import Sidebar from './Sidebar';
import TryBanner from './TryBanner';
import IntroBanner from './IntroBanner';
import { quickstartNavigationAction } from '../action/quickstartNavigationAction';
import highlightCode from '../browser/highlightCode';
import setAnchorLinks from '../browser/anchorLinks';
import ApplicationStore from '../stores/ApplicationStore';

// TODO: Uses ref from within tutorial navigator, can we move this?
function initTutorialInBrowser() {
  highlightCode();
  setAnchorLinks();
  // Execute any scripts that came with the article
  if (this.refs.article && this.refs.article.innerHTML) {
    const dom = $(this.refs.article.innerHTML);
    dom.filter('script').each(() => {
      $.globalEval(this.text || this.textContent || this.innerHTML || '');
    });
  }
}

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
  }

  componentDidUpdate() {
    this.initClient();
  }

  initClient() {
    if (typeof document !== 'undefined') {
      this.metrics();
    }
  }

  metrics() {
    const { quickstart, platform } = this.props;
    if (!window.widget) return;
    const eventData = {
      clientID: window.widget.getClient()._clientID || '',
      'tutorial-apptype': quickstart ? quickstart.name : '',
      'tutorial-platform': platform ? platform.name : ''
    };
    $('#package .btn').off('click').on('click', () => {
      this.context.getComponentContext().trackEvent('download:tutorial-seed', eventData);
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

    if (article) {
      tutorial = <Tutorial
        quickstart={quickstart}
        platform={platform}
        article={article}
        componentLoadedInBrowser={initTutorialInBrowser} />
      prevNext = <TutorialPrevNext
        quickstart={quickstart}
        platform={platform}
        currentArticle={article}
        customNavigationAction={quickstartNavigationAction} />
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
                    <Breadcrumbs {...this.props} customNavigationAction={quickstartNavigationAction} />
                  </div>
                  <section className="docs-content">
                    <IntroBanner />
                    <article data-swiftype-index='true'>
                      <h1 className="tutorial-title">{this.renderTitle()}</h1>
                      <div data-swiftype-name="body" data-swiftype-type="text">{tutorial}</div>
                      <div data-swiftype-index='false'>{prevNext}</div>
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
