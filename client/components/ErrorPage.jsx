import React from 'react';
import { Breadcrumbs, TutorialStore } from 'auth0-tutorial-navigator';
import SearchBox from './SearchBox';
import SideNavBar from './SideNavBar';
import strings from '../../lib/strings';
import { connectToStores } from 'fluxible-addons-react';

class ErrorPage extends React.Component {

  render() {
    var title = this.props.status === 404 ? strings.PAGE_NOT_FOUND : strings.ERROR_PROCESSING_REQUEST;
    return (
      <div className="docs-single">
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
                <h1>{this.props.title}</h1>
                <h2>{this.props.status}</h2>
              </section>
            </div>
          </div>
        </div>
      </div>
    );
  }

}

ErrorPage.contextTypes = {
  getStore: React.PropTypes.func
};

ErrorPage = connectToStores(ErrorPage, [TutorialStore], (context, props) => {
  return context.getStore(TutorialStore).getState();
});

export default ErrorPage;
