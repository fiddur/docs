import React from 'react';
import { StickyContainer, Sticky } from 'react-sticky';
import { connectToStores, provideContext } from 'fluxible-addons-react';
import { TutorialStore, Breadcrumbs, Tutorial, TutorialTableOfContents, TutorialPrevNext } from 'auth0-tutorial-navigator';
import NavigationBar from './NavigationBar';
import TryBanner from './TryBanner';
import IntroBanner from './IntroBanner';
import { quickstartNavigationAction } from '../action/quickstartNavigationAction';
import highlightCode from '../browser/highlightCode';
import setAnchorLinks from '../browser/anchorLinks';
import UserStore from '../stores/UserStore';
import Sidebar from './Sidebar';

// TODO: Uses ref from within tutorial navigator, can we move this?
const initTutorialInBrowser = function () {
  highlightCode();
  setAnchorLinks();

  // Execute any scripts that came with the article
  if (this.refs.article && this.refs.article.innerHTML) {
    var dom = $(this.refs.article.innerHTML);
    dom.filter('script').each(function () {
      $.globalEval(this.text || this.textContent || this.innerHTML || '');
    });
  }
};

class TutorialPage extends React.Component {

  constructor(props) {
    super(props);

    // Transform quickstart object to pass as prop to Sidebar
    this.sidebarItems = Object
      .keys(props.quickstart.platforms).map(key => props.quickstart.platforms[key])
      .map((item) => Object.assign({}, item, { children: item.articles }));
  }

  componentDidMount () {
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
    let {quickstart, platform} = this.props;
    if (!window.widget) return;
    let eventData = {
      'clientID': window.widget.getClient()._clientID || '',
      'tutorial-apptype': quickstart ? quickstart.name : '',
      'tutorial-platform': platform ? platform.name : ''
    };
    $('#package .btn').off('click').on('click', function() {
      context.getComponentContext().trackEvent('download:tutorial-seed', eventData);
    });
  }

  renderTitle() {
    let {platform, article} = this.props;
    if (platform && article) {
      if (platform.articles.length == 1) {
        return platform.title;
      }
      else {
        return platform.title + ' ' + article.title;
      }
    }
  }

  render() {

    const { quickstart, platform, article, isAuthenticated } = this.props;
    const tryBanner = isAuthenticated ? null : <TryBanner />;

    let tutorial = undefined;
    let sidebar = undefined;
    let prevNext = undefined;

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
                    section={quickstart.title} maxDepth={3}
                    items={this.sidebarItems} url={this.props.currentRoute.url}
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
  article: React.PropTypes.object,
};

TutorialPage.contextTypes = {
  getStore: React.PropTypes.func,
  executeAction: React.PropTypes.func,
  trackEvent: React.PropTypes.func.isRequired
};

TutorialPage = connectToStores(TutorialPage, [TutorialStore, UserStore], (context, props) => {
  let tutorialStore = context.getStore(TutorialStore);
  let userStore = context.getStore(UserStore);
  return {
    quickstart: tutorialStore.getCurrentQuickstart(),
    platform: tutorialStore.getCurrentPlatform(),
    article: tutorialStore.getCurrentArticle(),
    isAuthenticated: userStore.isAuthenticated()
  };
});

export default TutorialPage;
