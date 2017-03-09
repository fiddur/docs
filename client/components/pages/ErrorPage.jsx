import React, { Component, PropTypes } from 'react';
import { StickyContainer } from 'react-sticky';
import { connectToStores } from 'fluxible-addons-react';
import NavigationStore from '../../stores/NavigationStore';
import Sidebar from '../Sidebar';
import NavigationBar from '../NavigationBar';

class ErrorPage extends Component {

  render() {
    const { error, sidebarArticles } = this.props;

    let stack;
    if (error.stack) {
      stack = (
        <pre style={{ padding: '30px', overflowX: 'auto' }}>
          {error.stack}
        </pre>
      );
    }

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
                  <h1>Error {error.status}</h1>
                  <p>{error.message}</p>
                  {stack}
                </section>
              </div>
            </div>
          </div>
        </div>
      </StickyContainer>
    );
  }

}

ErrorPage.propTypes = {
  error: PropTypes.object,
  sidebarArticles: PropTypes.array
};

ErrorPage = connectToStores(ErrorPage, [], (context, props) => {
  const navigationStore = context.getStore(NavigationStore);
  return {
    sidebarArticles: navigationStore.getSidebarArticles('articles')
  };
});


export default ErrorPage;
