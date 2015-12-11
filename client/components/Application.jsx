/*globals document, $*/

import React from 'react';
import ApplicationStore from '../stores/ApplicationStore';
import { connectToStores, provideContext } from 'fluxible-addons-react';
import { handleHistory } from 'fluxible-router';
import ErrorPage from './ErrorPage';

class Application extends React.Component {

  render() {
    // Temporary fix for: https://github.com/yahoo/fluxible-router/issues/108
    if (!this.props.currentRoute && typeof document !== 'undefined') {
      document.location = document.location;
    }

    var Handler = this.props.currentRoute.get('handler');

    if (Handler) {
      if (this.props.currentNavigateError) {
        var status = this.props.currentNavigateError.message === 'Not Found' ? 404 : 500;
        Handler = <ErrorPage status={status} />;
      }
      else {
        Handler = <Handler />;
      }
    }
    else {
        Handler = <ErrorPage status={404}  />;
    }

    return (
      <div>
        {Handler}
      </div>
    );
  }

  componentDidUpdate(prevProps, prevState) {
    const newProps = this.props;
    if (newProps.pageTitle !== prevProps.pageTitle) {
      document.title = newProps.pageTitle;
    }
  }
}

export default handleHistory(provideContext(connectToStores(
  Application,
  [ApplicationStore],
  function (context, props) {
    var appStore = context.getStore(ApplicationStore);
    return {
      currentPageName: appStore.getCurrentPageName(),
      pageTitle: appStore.getPageTitle(),
      pageDescription: appStore.getPageDescription(),
      pages: appStore.getPages()
    };
  }
)), { enableScroll: false });
