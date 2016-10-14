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
    let { content } = this.props;
    const { url } = this.props.currentRoute;

    // If the document's content hasn't been loaded yet, display a spinner.
    if (!content || !content.html || !content.meta) {
      return (
        <section className="docs-content">
          <div className='auth0-spinner'>
            <div className='spinner'></div>
          </div>
        </section>
      );
    }

    let classes = ['content']
    if (content.meta) classes = classes.concat(content.meta.classes);

    return (
      <section className={classes.join(' ')} data-swiftype-name="body" data-swiftype-type="text" data-swiftype-index='true' dangerouslySetInnerHTML={{__html: content.html}} />
    );
  }

}

StaticPage = connectToStores(StaticPage, [StaticContentStore], (context, props) => {

  let {url} = props.currentRoute;
  let appStore = context.getStore(ApplicationStore);
  let staticContentStore = context.getStore(StaticContentStore);

  return {
    url,
    env: appStore.getEnvironmentVars(),
    title: appStore.getPageTitle(),
    description: appStore.getPageDescription(),
    content: staticContentStore.getContent()
  };
});

export default StaticPage;
