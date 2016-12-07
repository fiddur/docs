import React from 'react';
import { connectToStores, provideContext } from 'fluxible-addons-react';
import { handleHistory } from 'fluxible-router';
import ApplicationStore from '../stores/ApplicationStore';
import UserStore from '../stores/UserStore';
import DocumentStore from '../stores/DocumentStore';
import ErrorPage from './pages/ErrorPage';
import highlightCode from '../browser/highlightCode';
import Header from './Header';
import sendMessageToParentFrame from '../util/sendMessageToParentFrame';

class Application extends React.Component {

  componentDidMount() {
    if (this.props.isFramedMode) {
      sendMessageToParentFrame({ type: 'ready' });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const newProps = this.props;
    if (newProps.pageTitle !== prevProps.pageTitle) {
      document.title = newProps.pageTitle;
    }
    if (newProps.currentRoute.url !== prevProps.currentRoute.url) {
      this.props.context.trackPage();
    }
    if (newProps.isFramedMode) {
      sendMessageToParentFrame({ type: 'contentChanged' });
    }
    this.initClientScripts();
  }

  initClientScripts() {
    highlightCode();
  }

  getHandler() {
    const { doc, currentRoute, currentNavigateError } = this.props;

    if (!currentRoute) {
      let error = { message: 'Not Found', status: 404 };
      return <ErrorPage error={error} />;
    }

    if (doc && doc.err) {
      return <ErrorPage error={doc.err} />;
    }

    if (currentNavigateError) {
      return <ErrorPage error={currentNavigateError} />;
    }

    let Handler = currentRoute.handler;
    return <Handler {...this.props} />;
  }


  render() {
    const { currentRoute, user, isFramedMode, isFullWidthMode } = this.props;

    // Temporary fix for: https://github.com/yahoo/fluxible-router/issues/108
    if (!currentRoute && typeof document !== 'undefined') {
      document.location = document.location;
    }

    let header;
    if (!isFramedMode) {
      header = (
        <Header
          theme="gray"
          user={user}
          currentRoute={currentRoute}
          fullWidth={isFullWidthMode}
        />
      );
    }

    const styles = ['docs-application'];
    if (isFramedMode) styles.push('framed-mode');

    return (
      <div className={styles.join(' ')}>
        {header}
        {this.getHandler()}
      </div>
    );
  }

}

Application.propTypes = {
  doc: React.PropTypes.object,
  currentRoute: React.PropTypes.object.isRequired,
  isAuthenticated: React.PropTypes.bool.isRequired,
  isFramedMode: React.PropTypes.bool.isRequired,
  isFullWidthMode: React.PropTypes.bool.isRequired,
  pageTitle: React.PropTypes.string.isRequired,
  user: React.PropTypes.object
};

Application = connectToStores(Application, [ApplicationStore], (context, props) => {
  const appStore = context.getStore(ApplicationStore);
  const userStore = context.getStore(UserStore);

  let doc;
  if (props.currentRoute) {
    doc = context.getStore(DocumentStore).getDocument(props.currentRoute.url);
  }

  return {
    doc,
    currentRoute: props.currentRoute,
    isAuthenticated: userStore.isAuthenticated(),
    isFramedMode: appStore.isFramedMode(),
    isFullWidthMode: appStore.isFullWidthMode(),
    pageTitle: appStore.getPageTitle(),
    user: userStore.isAuthenticated() ? userStore.getUser() : undefined
  };
});

Application = provideContext(Application, {
  trackEvent: React.PropTypes.func.isRequired,
  trackPage: React.PropTypes.func.isRequired
});

Application = handleHistory(Application);

export default Application;
