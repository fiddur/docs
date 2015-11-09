import React from 'react';
import Breadcrumbs from './Breadcrumbs';
import SearchBox from './SearchBox';
import SideNavBar from './SideNavBar';
import Tutorial from './Tutorial';
import TutorialStore from '../stores/TutorialStore';
import { getPlatformName, getTechTitle } from '../util/tutorials';
import { connectToStores, provideContext } from 'fluxible-addons-react';
import loadSdkSnippet from '../browser/loadSdkSnippet';

class TutorialPage extends React.Component {
  componentDidMount () {
    this.initClient();
  }
  componentDidUpdate() {
    this.initClient();
  }
  initClient(html) {
    if (typeof document !== 'undefined') {
      $('body').on('click', '.nav-tabs a', function(e) {
        e.preventDefault();
        $(this).tab('show');
      });
      loadSdkSnippet({
        callbackOnHashMode: false,
        backend: this.props.tech2 ? '' : this.props.tech1, // Only set this if we are using a single tech.
        clientId: window.CONFIG.account.clientId,
      });
    }
  }
  render() {
    var title1 = getTechTitle(this.props.quickstart, this.props.appType, this.props.tech1);
    var title2 = '';
    var pageTitle = title1;
    var hasTutorial2 = this.props.tech2 && this.props.tech2 !== 'no-api';
    var tutorial2Tab;
    if (hasTutorial2) {
      title2 = getTechTitle(this.props.quickstart, 'backend', this.props.tech2);
      pageTitle += ' + ' + title2;
      tutorial2Tab = (
        <Tutorial tabName="tutorial-2" appType="backend" tech={this.props.tech2} />
      );
    }
    return (
      <div id="tutorial-template" className="docs-single animated fadeIn">
        <div className="navigation-bar">
          <div className="wrapper">
            <div className="container">
              <Breadcrumbs {...this.props} />
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
                <h1 className="tutorial-title">{pageTitle}</h1>
                <ul className={'nav nav-tabs' + (hasTutorial2 ? '' : ' hide')}>
                  <li className="active"><a href="#tutorial-1" data-toggle="tab">{title1}</a></li>
                  <li><a href="#tutorial-2" data-toggle="tab">{title2}</a></li>
                </ul>
                <div className="tab-content">
                  <Tutorial tabName="tutorial-1"
                    default={true}
                    appType={this.props.appType}
                    tech={this.props.tech1} />
                  {tutorial2Tab}
                </div>
              </section>

              <div id="try-banner">
                <div className="try-banner">
                  <span>Try Auth0 for FREE</span>
                  <a href="javascript:signup()" className="btn btn-success btn-lg">Create free Account</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

TutorialPage.contextTypes = {
  getStore: React.PropTypes.func,
  executeAction: React.PropTypes.func
};

TutorialPage = connectToStores(TutorialPage, [TutorialStore], (context, props) => {
  return context.getStore(TutorialStore).getState();
});

export default TutorialPage;
