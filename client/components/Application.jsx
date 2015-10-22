/*globals document*/

import React from 'react';
import ApplicationStore from '../stores/ApplicationStore';
import { connectToStores, provideContext } from 'fluxible-addons-react';
import { handleHistory } from 'fluxible-router';

class Application extends React.Component {
  render() {
    var Handler = this.props.currentRoute.get('handler');

    return (
      <div>
        <Handler baseUrl={this.props.baseUrl} />
      </div>
    );
  }

  componentDidUpdate(prevProps, prevState) {
    const newProps = this.props;
    if (newProps.pageTitle !== prevProps.pageTitle) {
      document.title = newProps.pageTitle;
    }
    if (newProps.pageDescription !== prevProps.pageDescription) {
      console.log(newProps.pageDescription);
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
      pages: appStore.getPages(),
      baseUrl: appStore.getBaseUrl()
    };
  }
)), { enableScroll: false });
