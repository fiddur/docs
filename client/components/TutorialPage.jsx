import React from 'react';
import NavigationBar from './NavigationBar';
import TryBanner from './TryBanner';
import IntroBanner from './IntroBanner';
import { TutorialStore, Breadcrumbs, Tutorial, TutorialTableOfContents, TutorialPrevNext } from 'auth0-tutorial-navigator';
import { connectToStores, provideContext } from 'fluxible-addons-react';
import { quickstartNavigationAction } from '../action/quickstartNavigationAction';
import highlightCode from '../browser/highlightCode';
import setAnchorLinks from '../browser/anchorLinks';
import UserStore from '../stores/UserStore';

// TODO: Uses ref from within tutorial navigator, can we move this?
var initTutorialInBrowser = function() {
  highlightCode();
  setAnchorLinks();

  // Execute any scripts that came with the article
  if (this.refs.article && this.refs.article.innerHTML) {
    var dom = $(this.refs.article.innerHTML);
    dom.filter('script').each(function(){
      $.globalEval(this.text || this.textContent || this.innerHTML || '');
    });
  }
};

class TutorialPage extends React.Component {

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

    let {quickstart, platform, article, isAuthenticated} = this.props;
    let tryBanner = isAuthenticated ? null : <TryBanner/>;

    let tutorial = undefined;
    let sidebar = undefined;
    let prevNext = undefined;
    let classes = ['col-sm-9'];

    if (platform && platform.articles.length > 1) {
      sidebar = <div className="col-sm-3">
        <TutorialTableOfContents
          quickstart={quickstart}
          platform={platform}
          currentArticle={article}
          customNavigationAction={quickstartNavigationAction} />
      </div>;
    }
    else {
      classes.push('col-centered');
    }

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
      <div id="tutorial-template" className="docs-single animated fadeIn">
        <NavigationBar />
        <div className="js-doc-template container">
          <div className="row">
            {sidebar}
            <div className={classes.join(' ')}>
              <div className="navigation">
                <Breadcrumbs {...this.props} customNavigationAction={quickstartNavigationAction} />
              </div>
              <section className="docs-content">
                <IntroBanner />
                <h1 className="tutorial-title">{this.renderTitle()}</h1>
                {tutorial}
                {prevNext}
              </section>
              {tryBanner}
            </div>
          </div>
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
