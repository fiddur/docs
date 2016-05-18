import React from 'react';
import SearchBox from './SearchBox';
import SideNavBar from './SideNavBar';
import TryBanner from './TryBanner';
import { TutorialStore, Breadcrumbs, Tutorial, TutorialTableOfContents } from 'auth0-tutorial-navigator';
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

  var removeHeader = () => {
    var article = this.refs.article;
    if (article) {
      var child = article.firstChild;
      if (child.nodeName === 'H1' || child.nodeName === 'H2') {
        child.classList.add('hide');
      } else if (child.nodeName === 'P' && child.textContent === '') {
        article.removeChild(child);
        removeHeader();
      }
    }
  };
  removeHeader();
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
      $('body').on('click', '.nav-tabs a', function(e) {
        e.preventDefault();
        $(this).tab('show');
      });
      this.metrics();
    }
  }
  
  metrics() {
    let {quickstart, platform} = this.props;
    let eventData = {
      'clientID': window.widget.getClient()._clientID || '',
      'tutorial-apptype': quickstart ? quickstart.name : '',
      'tutorial-platform': platform ? platform.name : ''
    };
    $('#package .btn').off('click').on('click', function() {
      context.getComponentContext().trackEvent('download:tutorial-seed', eventData);
    });
  }
  
  render() {
    
    let {quickstart, platform, article, isAuthenticated} = this.props;
    let tryBanner = isAuthenticated ? null : <TryBanner/>;
    
    let title = undefined;
    let tutorial = undefined;
    let toc = undefined;
    
    if (platform) {
      title = platform.title;
      if (platform.articles.length > 1) {
        toc = <TutorialTableOfContents
          quickstart={quickstart}
          platform={platform}
          currentArticle={article}
          customNavigationAction={quickstartNavigationAction} />;
      }
    }
    
    if (article) {
      tutorial = <Tutorial
        quickstart={quickstart}
        platform={platform}
        article={article}
        componentLoadedInBrowser={initTutorialInBrowser} />
    }

    return (
      <div id="tutorial-template" className="docs-single animated fadeIn">
        <div className="navigation-bar">
          <div className="wrapper">
            <div className="container">
              <Breadcrumbs {...this.props} customNavigationAction={quickstartNavigationAction} />
              <SearchBox />
            </div>
          </div>
        </div>
        <div className="js-doc-template container">
          <div className="row">
            <div className="col-sm-3">
              {toc}
            </div>
            <div className="col-sm-9">
              <section className="docs-content">
                <h1 className="tutorial-title">{title}</h1>
                {tutorial}
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
