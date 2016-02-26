import React from 'react';
import SearchBox from './SearchBox';
import SideNavBar from './SideNavBar';
import { TutorialStore, Breadcrumbs, Tutorial } from 'auth0-tutorial-navigator';
import { getPlatformName, getTechTitle } from '../util/tutorials';
import { connectToStores, provideContext } from 'fluxible-addons-react';
import { quickstartNavigationAction } from '../action/quickstartNavigationAction';
import highlightCode from '../browser/highlightCode';
import setAnchorLinks from '../browser/anchorLinks';
import UserStore from '../stores/UserStore';
import TopNav from './TopNav';

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
    // auth0-metrics is safelly loaded in `<head>` block...
    var metrics = window.metricsLib;
    // ... but only when `env['SEGMENT_KEY']` is defined
    if (!!metrics) {
      return false;
    }

    $('#package .btn').off('click').on('click', function() {
      metrics.track('download:tutorial-seed', {
        'clientID': window.widget.getClient()._clientID || '',
        'tutorial-apptype': this.props.apptype || '',
        'tutorial-platform': this.props.tech1 || '',
        'tutorial-api': this.props.tech2 || ''
      });
    });
  }
  render() {
    var title1 = getTechTitle(this.props.quickstart, this.props.appType, this.props.tech1);
    var title2 = '';
    var pageTitle = title1;
    var hasTutorial2 = this.props.tech2 && this.props.tech2 !== 'no-api';
    var tutorial2Tab;
    var componentLoadedInBrowser = function(){
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

    if (hasTutorial2) {
      title2 = getTechTitle(this.props.quickstart, 'backend', this.props.tech2);
      pageTitle += ' + ' + title2;
      tutorial2Tab = (
        <Tutorial tabName="tutorial-2" appType="backend" tech={this.props.tech2} componentLoadedInBrowser={componentLoadedInBrowser} />
      );
    }

    var tryBanner;
    if (!this.props.isAuthenticated) {
      tryBanner = (
        <div id="try-banner">
          <div className="try-banner">
            <span>Try Auth0 for FREE</span>
            <a href="javascript:signup()" className="btn btn-success btn-lg">Create free Account</a>
          </div>
        </div>
      );
    }
    // <div className="navigation-bar">
    //   <div className="wrapper">
    //     <div className="container">
    //       <Breadcrumbs {...this.props}  customNavigationAction={quickstartNavigationAction} />
    //       <SearchBox />
    //     </div>
    //   </div>
    // </div>

    return (
      <div id="tutorial-template" className="docs-single animated fadeIn">
        <TopNav {...this.props} />
        <div className="js-doc-template container">
          <div className="row">
            <div className="col-sm-3">
              <SideNavBar />
            </div>
            <div className="col-sm-9">
              <section className="docs-content">
                <h1 className="tutorial-title">{pageTitle}</h1>
                <ul className={'nav nav-tabs' + (hasTutorial2 ? '' : ' hide')}>
                  <li className="active"><a href="#tutorial-1" data-toggle="tab">{title1}</a></li>
                  <li><a href="#tutorial-2" data-toggle="tab">{title2}</a></li>
                </ul>
                <div className="tab-content">
                  <Tutorial tabName="tutorial-1"
                    default={true}
                    componentLoadedInBrowser={componentLoadedInBrowser}
                    appType={this.props.appType}
                    tech={this.props.tech1} />
                  {tutorial2Tab}
                </div>
              </section>
              {tryBanner}
            </div>
          </div>
        </div>
      </div>);
  }
}

TutorialPage.contextTypes = {
  getStore: React.PropTypes.func,
  executeAction: React.PropTypes.func
};

TutorialPage = connectToStores(TutorialPage, [TutorialStore, UserStore], (context, props) => {
  var state = context.getStore(TutorialStore).getState();
  state.isAuthenticated = context.getStore(UserStore).isAuthenticated();
  return state;
});

export default TutorialPage;
