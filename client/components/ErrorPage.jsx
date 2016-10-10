import React from 'react';
import { StickyContainer } from 'react-sticky';
import { connectToStores } from 'fluxible-addons-react';
import NavigationStore from '../stores/NavigationStore';
import Sidebar from './Sidebar';
import NavigationBar from './NavigationBar';

class ErrorPage extends React.Component {

  render() {

    var { error, sidebarArticles } = this.props;

    return (
      <StickyContainer>
        <div className="docs-single docs-error">
          <NavigationBar currentSection="articles" />
          <div className="js-doc-template container">
            <div className="row">
              <div className="sidebar-container col-md-3">
                <Sidebar section="articles" items={sidebarArticles} url="" />
              </div>
              <div className="col-md-9">
                <section className="docs-content">
                  <h1>{error.title}</h1>
                  <h2>Error {error.status}</h2>
                  <p>{error.message}</p>
                  <pre style={{ padding: '30px', overflowX: 'auto' }}>
                    {error.stack}
                  </pre>
                </section>
              </div>
            </div>
          </div>
        </div>
      </StickyContainer>
    );
  }

}

ErrorPage = connectToStores(ErrorPage, [], (context, props) => {
  const navigationStore = context.getStore(NavigationStore);

  return {
    sidebarArticles: navigationStore.getSidebarArticles('articles')
  };
});


export default ErrorPage;
