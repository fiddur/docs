/*globals document, $*/

import React from 'react';
import ApplicationStore from '../stores/ApplicationStore';
import { connectToStores, provideContext } from 'fluxible-addons-react';
import { handleHistory } from 'fluxible-router';
import ErrorPage from './ErrorPage';
import highlightCode from '../browser/highlightCode';
import feedbackSender from '../browser/feedbackSender';
import Header from './Header';

class Application extends React.Component {

  componentDidMount() {
    this.initClientScripts();
    this.props.context.trackPage();
  }

  componentDidUpdate(prevProps, prevState) {
    const newProps = this.props;
    if (newProps.pageTitle !== prevProps.pageTitle) {
      document.title = newProps.pageTitle;
    }
    if (newProps.currentRoute.url !== prevProps.currentRoute.url) {
      this.props.context.trackPage();
    }
    this.initClientScripts();
  }

  initClientScripts() {
    highlightCode();
    feedbackSender();
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
        Handler = <Handler {...this.props} />;
      }
    }
    else {
      let error = {message: 'Not Found', status: 404};
      Handler = <ErrorPage error={error} />;
    }

    const isFramedMode = this.props.env['RENDER_MODE'] === 'framed';

    return (
      <div>
        {isFramedMode ? null : <Header/>}
        <div>
          {Handler}
        </div>
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
      user: appStore.getUser(),
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
