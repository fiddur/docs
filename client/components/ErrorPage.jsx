import React from 'react';
import { Breadcrumbs, TutorialStore } from 'auth0-tutorial-navigator';
import Sidebar from './Sidebar';
import NavigationBar from './NavigationBar';
import strings from '../../lib/strings';
import { connectToStores } from 'fluxible-addons-react';

class ErrorPage extends React.Component {

  render() {
    var title = this.props.status === 404 ? strings.PAGE_NOT_FOUND : strings.ERROR_PROCESSING_REQUEST;
    return (
      <div className="docs-single">
        <NavigationBar />
        <div className="js-doc-template container">
          <div className="row">
            <div className="col-sm-3">
              <Sidebar />
            </div>
            <div className="col-sm-9">
              <section className="docs-content">
                <h1>{title}</h1>
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
  return context.getStore(TutorialStore).dehydrate();
});

export default ErrorPage;
