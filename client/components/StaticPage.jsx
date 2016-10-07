import React from 'react';
import { navigateAction } from 'fluxible-router';
import { connectToStores } from 'fluxible-addons-react';
import ApplicationStore from '../stores/ApplicationStore';
import NavigationStore from '../stores/NavigationStore';
import StaticContentStore from '../stores/StaticContentStore';
import NavigationBar from './NavigationBar';
import Sidebar from './Sidebar';
import FeedbackFooter from './FeedbackFooter';
import setAnchorLinks from '../browser/anchorLinks';

class StaticPage extends React.Component {

  render() {
    let { html, metadata } = this.props;
    const { url } = this.props.currentRoute;

    // If the document's content hasn't been loaded yet, display a spinner.
    if (!html) {
      return (
        <section className="docs-content">
          <div className='auth0-spinner'>
            <div className='spinner'></div>
          </div>
        </section>
      );
    }

    let classes = ['content']
    if (metadata) classes = classes.concat(metadata.classes);

    return (
      <section className={classes.join(' ')} data-swiftype-name="body" data-swiftype-type="text" data-swiftype-index='true' dangerouslySetInnerHTML={{__html: html}} />
    );
  }

}

StaticPage = connectToStores(StaticPage, [StaticContentStore], (context, props) => {

  let {url} = props.currentRoute;
  let appStore = context.getStore(ApplicationStore);
  let contentStore = context.getStore(StaticContentStore);
  let navigationStore = context.getStore(NavigationStore);

  return {
    url,
    env: appStore.getEnvironmentVars(),
    title: appStore.getPageTitle(),
    description: appStore.getPageDescription(),
    html: contentStore.getContentHtml(),
    metadata: navigationStore.getMetadata(url)
  };
});

export default StaticPage;
