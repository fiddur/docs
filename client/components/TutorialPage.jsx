import React from 'react';
import Breadcrumbs from './Breadcrumbs';
import SearchBox from './SearchBox';
import SideNavBar from './SideNavBar';
import Tutorial from './Tutorial';
import TutorialStore from '../stores/TutorialStore';
import { getPlatformName, getTechTitle } from '../util/tutorials';
import { connectToStores, provideContext } from 'fluxible-addons-react';

class TutorialPage extends React.Component {
  render() {
    var title1 = getTechTitle(this.props.quickstart, this.props.appType, this.props.tech1);
    var title2 = getTechTitle(this.props.quickstart, 'backend', this.props.tech2);
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
                <SideNavBar baseUrl={this.props.baseUrl} />
              </div>
              <div className="col-sm-9">
                <section className="docs-content">
                  <h1 className="tutorial-title">{title1 + ' + ' + title2}</h1>
                  <ul className="nav nav-tabs">
                    <li className="active"><a href="#tutorial-1" data-toggle="tab">{title1}</a></li>
                    <li><a href="#tutorial-2" data-toggle="tab">{title2}</a></li>
                  </ul>
                  <div className="tab-content">
                    <Tutorial tabName="tutorial-1"
                              default={true}
                              appType={this.props.appType}
                              tech={this.props.tech1} />
                    <Tutorial tabName="tutorial-2"
                              appType="backend"
                              tech={this.props.tech2} />
                  </div>
                </section>
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
