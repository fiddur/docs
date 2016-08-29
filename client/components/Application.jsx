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
    //this.startWatchingTenantCookie();
  }

  componentDidUpdate(prevProps, prevState) {
    const newProps = this.props;
    if (newProps.pageTitle !== prevProps.pageTitle) {
      document.title = newProps.pageTitle;
    }
    this.initClientScripts();
  }

  initClientScripts() {
    highlightCode();
    feedbackSender();
  }

  startWatchingTenantCookie() {
    let {env, user} = this.props;

    if (!user || !user.tenant) return;

    let getCookie = function(name) {
      let match = document.cookie.match(RegExp('(?:^|;\\s*)' + name + '=([^;]*)'));
      return match ? match[1] : null;
    };

    let setCookie = function(name, value, days) {
      let date = new Date();
      date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
      document.cookie = `${name}=${value}; expires=${date.toGMTString()}; path=/; domain=${env['COOKIE_SCOPE']}`;
    };

    setCookie(env['CURRENT_TENANT_COOKIE'], user.tenant, 7);

    setInterval(function() {
      let currentTenant = getCookie(env['CURRENT_TENANT_COOKIE']);
      if (currentTenant && currentTenant !== user.tenant) {
        window.location.reload(true);
      }
    }, 3000);
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
    const isFramedMode = this.props.env['RENDER_MODE'] === 'framed';

    return (
      <div>
        {isFramedMode
          ? null
          : <Header />
        }
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
