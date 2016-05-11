import React from 'react';
import SearchBox from './SearchBox';
import SideNavBar from './SideNavBar';
import TryBanner from './TryBanner';
import { TutorialStore, Breadcrumbs, Tutorial } from 'auth0-tutorial-navigator';
import { getPlatformName, getPlatformTitle } from '../util/tutorials';
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
    var eventData = {
      'clientID': window.widget.getClient()._clientID || '',
      'tutorial-apptype': this.props.appType || '',
      'tutorial-platform': this.props.platform || ''
    };
    $('#package .btn').off('click').on('click', function() {
      context.getComponentContext().trackEvent('download:tutorial-seed', eventData);
    });
  }
  
  render() {
    
    let {quickstart, appType, platform, article, isAuthenticated} = this.props;
    let title = getPlatformTitle(quickstart, appType, platform);
    let tryBanner = isAuthenticated ? null : <TryBanner/>;

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
              <SideNavBar />
            </div>
            <div className="col-sm-9">
              <section className="docs-content">
                <h1 className="tutorial-title">{title}</h1>
                <Tutorial appType={appType} platform={platform} article={article} componentLoadedInBrowser={initTutorialInBrowser} />
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
  appType: React.PropTypes.string,
  platform: React.PropTypes.string,
  article: React.PropTypes.string,
};

TutorialPage.contextTypes = {
  getStore: React.PropTypes.func,
  executeAction: React.PropTypes.func,
  trackEvent: React.PropTypes.func.isRequired
};

TutorialPage = connectToStores(TutorialPage, [TutorialStore, UserStore], (context, props) => {
  var state = context.getStore(TutorialStore).getState();
  state.isAuthenticated = context.getStore(UserStore).isAuthenticated();
  return state;
});

export default TutorialPage;
