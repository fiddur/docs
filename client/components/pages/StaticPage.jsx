import React from 'react';
import { navigateAction } from 'fluxible-router';
import { connectToStores } from 'fluxible-addons-react';
import ApplicationStore from '../../stores/ApplicationStore';
import NavigationStore from '../../stores/NavigationStore';
import StaticContentStore from '../../stores/StaticContentStore';
import NavigationBar from '../NavigationBar';
import Sidebar from '../Sidebar';
import FeedbackFooter from '../FeedbackFooter';
import setAnchorLinks from '../../browser/anchorLinks';

class StaticPage extends React.Component {

  render() {
    const { content } = this.props;

    // If the document's content hasn't been loaded yet, display a spinner.
    if (!content || !content.html || !content.meta) {
      return (
        <section className="docs-content">
          <div className="auth0-spinner">
            <div className="spinner" />
          </div>
        </section>
      );
    }

    let classes = ['content']
    if (content.meta) classes = classes.concat(content.meta.classes);

    return (
      <section
        className={classes.join(' ')}
        data-swiftype-name="body"
        data-swiftype-type="text"
        data-swiftype-index="true"
        dangerouslySetInnerHTML={{ __html: content.html }}
      />
    );
  }

}

StaticPage = connectToStores(StaticPage, [StaticContentStore], (context, props) => {
  const { url } = props.currentRoute;
  const appStore = context.getStore(ApplicationStore);
  const staticContentStore = context.getStore(StaticContentStore);

  return {
    url,
    content: staticContentStore.getContent()
  };
});

export default StaticPage;
