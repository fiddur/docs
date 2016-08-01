import React from 'react';
import Sidebar from './Sidebar';
import NavigationBar from './NavigationBar';

class ErrorPage extends React.Component {

  render() {

    var {error} = this.props;

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
                <h1>{error.title}</h1>
                <h2>{error.status}</h2>
                <pre>{error.stack}</pre>
              </section>
            </div>
          </div>
        </div>
      </div>
    );

  }

}

export default ErrorPage;
