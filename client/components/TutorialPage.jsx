import React from 'react';
import Breadcrumbs from './Breadcrumbs';
import SearchBox from './SearchBox';
import Tutorial from './Tutorial';
import TutorialStore from '../stores/TutorialStore';
import { getPlatformName, getTechTitle } from '../util/tutorials';

class TutorialPage extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = this.getStoreState();
  }
  getStoreState () {
    return this.context.getStore(TutorialStore).getState();
  }
  componentDidMount () {
    this.context
      .getStore(TutorialStore)
      .addChangeListener(this._onStoreChange.bind(this));

    if (document !== undefined) {
      var el = document.getElementById('homepage-content');
      el.classList.add('hide');
    }
  }
  componentWillUnmount () {
    this.context
      .getStore(TutorialStore)
      .removeChangeListener(this._onStoreChange.bind(this));
  }
  _onStoreChange () {
    this.setState(this.getStoreState());
  }
  render() {
    var title1 = getTechTitle(this.state.quickstart, this.state.appType, this.state.tech1);
    var title2 = getTechTitle(this.state.quickstart, 'backend', this.state.tech2);
      return (
        <div id="tutorial-template" className="docs-single animated fadeIn">
          <div className="navigation-bar">
            <div className="wrapper">
              <div className="container">
                <Breadcrumbs />
                <SearchBox />
              </div>
            </div>
          </div>
          <div className="js-doc-template container">
            <div className="row">
              <div className="col-sm-3">
                <div id="sidebar"></div>
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
                              appType={this.state.appType}
                              tech={this.state.tech1} />
                    <Tutorial tabName="tutorial-2"
                              appType="backend"
                              tech={this.state.tech2} />
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

export default TutorialPage;
