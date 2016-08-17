/*globals document, $*/

import React from 'react';
import ApplicationStore from '../stores/ApplicationStore';
import { connectToStores, provideContext } from 'fluxible-addons-react';
import { handleHistory } from 'fluxible-router';
import ErrorPage from './ErrorPage';
import analytics from '../browser/analytics';
import pingdom from '../browser/pingdom';
import locksso from '../browser/locksso';
import highlightCode from '../browser/highlightCode';
import feedbackSender from '../browser/feedbackSender';
import anchorLinks from '../browser/anchorLinks';

class Application extends React.Component {

  componentDidMount() {
    this.initClientScripts();
  }

  componentDidUpdate(prevProps, prevState) {
    const newProps = this.props;
    if (newProps.pageTitle !== prevProps.pageTitle) {
      document.title = newProps.pageTitle;
    }
    this.initClientScripts();
  }

  initClientScripts() {
    let {env} = this.props;
    pingdom(env['PINGDOM_ID']);
    analytics(env['MOUSEFLOW_ID'], env['SEGMENT_KEY'], env['DWH_ENDPOINT']);
    locksso(env['AUTH0_CLIENT_ID'], env['AUTH0_DOMAIN']);
    highlightCode();
    feedbackSender();
    anchorLinks();
  }

  render() {
    // Temporary fix for: https://github.com/yahoo/fluxible-router/issues/108
    if (!this.props.currentRoute && typeof document !== 'undefined') {
      document.location = document.location;
    }

    var Handler = undefined;
    if (this.props.currentRoute) Handler = this.props.currentRoute.handler;

    if (Handler) {
      if (this.props.error) {
        Handler = <ErrorPage error={this.props.error} />;
      }
      else if (this.props.currentNavigateError) {
        var status = this.props.currentNavigateError.message === 'Not Found' ? 404 : 500;
        Handler = <ErrorPage error={this.props.currentNavigateError} />;
      }
      else {
        Handler = <Handler />;
      }
    }
    else {
      let error = {message: 'Not Found', status: 404};
      Handler = <ErrorPage error={error} />;
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
      pageTitle: appStore.getPageTitle(),
      error: props.error
    };
  }
);

Application = provideContext(Application, {
  trackEvent: React.PropTypes.func.isRequired,
  trackPage: React.PropTypes.func.isRequired
});

Application = handleHistory(Application);

export default Application;
