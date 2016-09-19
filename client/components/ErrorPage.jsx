import React from 'react';
import { StickyContainer } from 'react-sticky';
import Sidebar from './Sidebar';
import NavigationBar from './NavigationBar';

class ErrorPage extends React.Component {

  render() {

    var { error } = this.props;

    return (
      <StickyContainer>
        <div className="docs-single docs-error">
          <NavigationBar />
          <div className="js-doc-template container">
            <div className="row">
              <div className="sidebar-container col-sm-3">
                <Sidebar />
              </div>
              <div className="col-sm-9">
                <section className="docs-content">
                  <h1>{error.title}</h1>
                  <h2>Error {error.status}</h2>
                  <p>{error.message}</p>
                  <pre>{error.stack}</pre>
                </section>
              </div>
            </div>
          </div>
        </div>
      </StickyContainer>
    );
  }

}

export default ErrorPage;
