import React from 'react';
import { connectToStores, provideContext } from 'fluxible-addons-react';
import { handleHistory } from 'fluxible-router';
import ApplicationStore from '../stores/ApplicationStore';
import ContentStore from '../stores/ContentStore';
import ErrorPage from './ErrorPage';
import highlightCode from '../browser/highlightCode';
import Header from './Header';

class Application extends React.Component {

  componentDidMount() {
    this.initClientScripts();
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
  }

  getHandler() {
    const { content, currentRoute, currentNavigateError } = this.props;

    if (!currentRoute) {
      let error = { message: 'Not Found', status: 404 };
      return <ErrorPage error={error} />;
    }

    if (content && content.err) {
      return <ErrorPage error={content.err} />;
    }

    if (currentNavigateError) {
      return <ErrorPage error={currentNavigateError} />;
    }

    let Handler = currentRoute.handler;
    return <Handler {...this.props} />;
  }


  render() {
    const { currentRoute, user } = this.props;
    const fullWidth = !!this.props.env.fullWidth;

    // Temporary fix for: https://github.com/yahoo/fluxible-router/issues/108
    if (!currentRoute && typeof document !== 'undefined') {
      document.location = document.location;
    }

    return (
      <div>
        <Header user={user} currentRoute={currentRoute} fullWidth={fullWidth} />
        {this.getHandler()}
      </div>
    );
  }

}

Application = connectToStores(Application, [ApplicationStore], (context, props) => {
  const appStore = context.getStore(ApplicationStore);

  let content;
  if (props.currentRoute) {
    content = context.getStore(ContentStore).getContent(props.currentRoute.url);
  }

  return {
    env: appStore.getEnvironmentVars(),
    user: appStore.getUser(),
    pageTitle: appStore.getPageTitle(),
    currentRoute: props.currentRoute,
    content
  };
});

Application = provideContext(Application, {
  trackEvent: React.PropTypes.func.isRequired,
  trackPage: React.PropTypes.func.isRequired
});

Application = handleHistory(Application);

export default Application;
