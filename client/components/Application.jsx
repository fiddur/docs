/*globals document, $*/

import React from 'react';
import ApplicationStore from '../stores/ApplicationStore';
import { connectToStores, provideContext } from 'fluxible-addons-react';
import { handleHistory } from 'fluxible-router';
import ErrorPage from './ErrorPage';
import analytics from '../scripts/analytics';
import pingdom from '../scripts/pingdom';
import locksso from '../scripts/locksso';

class Application extends React.Component {

  componentDidMount() {
    let {env} = this.props;
    pingdom(env['PINGDOM_ID']);
    analytics(env['SEGMENT_KEY'], env['DWH_ENDPOINT']);
    locksso(env['AUTH0_CLIENT_ID'], env['AUTH0_DOMAIN']);
  }

  componentDidUpdate(prevProps, prevState) {
    const newProps = this.props;
    if (newProps.pageTitle !== prevProps.pageTitle) {
      document.title = newProps.pageTitle;
    }
  }

  render() {
    // Temporary fix for: https://github.com/yahoo/fluxible-router/issues/108
    if (!this.props.currentRoute && typeof document !== 'undefined') {
      document.location = document.location;
    }

    var Handler = this.props.currentRoute.handler;

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

}

Application = connectToStores(
  Application,
  [ApplicationStore],
  function (context, props) {
    var appStore = context.getStore(ApplicationStore);
    return {
      env: appStore.getEnvironmentVars(),
      currentPageName: appStore.getCurrentPageName(),
      pageTitle: appStore.getPageTitle(),
      pageDescription: appStore.getPageDescription(),
      pages: appStore.getPages()
    };
  }
);

Application = provideContext(Application, {
  trackEvent: React.PropTypes.func.isRequired,
  trackPage: React.PropTypes.func.isRequired
});

Application = handleHistory(Application);

export default Application;
