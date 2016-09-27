import React from 'react';
import { navigateAction } from 'fluxible-router';
import { connectToStores } from 'fluxible-addons-react';
import { StickyContainer, Sticky } from 'react-sticky';
import ApplicationStore from '../stores/ApplicationStore';
import NavigationStore from '../stores/NavigationStore';
import ContentStore from '../stores/ContentStore';
import NavigationBar from './NavigationBar';
import Sidebar from './Sidebar';
import FeedbackFooter from './FeedbackFooter';
import setAnchorLinks from '../browser/anchorLinks';

class ArticlePage extends React.Component {

  componentDidMount() {
    this.executeEmbeddedScripts();
    //this.captureClicks();
    setAnchorLinks();
  }

  componentDidUpdate(prevProps) {
    this.executeEmbeddedScripts();
    //this.captureClicks();
    //this.scrollToAnchor();
    setAnchorLinks();
  }

  /*
  TODO: This code is used to enable partial refreshing between articles, but it's
  currently disabled because it doesn't support redirects.

  captureClicks() {
    $('a', this.refs.content).click(evt => {
      let {href} = evt.currentTarget;
      let location = window.location;
      let origin = location.origin || (location.protocol + '//' + location.host);
      if (href.indexOf(origin) == 0) {
        evt.preventDefault();
        let url = href.substring(origin.length) || '/'
        context.executeAction(navigateAction, {url, preserveScrollPosition: false});
        return false;
      }
    });
  }

  scrollToAnchor() {
    if (location.hash) {
      let anchor = document.getElementById(location.hash.substr(1));
      if (anchor) anchor.scrollIntoView();
    }
  }
  */

  executeEmbeddedScripts() {
    $('script', this.refs.content).each((idx, item) => {
      if (item.src) {
        item.remove();
        let el = document.createElement('script')
        el.src = item.src;
        document.body.appendChild(el);
      }
      else {
        $.globalEval(item.text || item.textContent || item.innerHTML || '');
      }
    });
  }

  renderContent() {
    let {url, html, metadata} = this.props;

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

    let classes = ['docs-content']
    if (metadata) classes = classes.concat(metadata.classes);

    return (
      <div>
        <article className={classes.join(' ')} data-swiftype-name="body" data-swiftype-type="text" data-swiftype-index='true' dangerouslySetInnerHTML={{__html: html}} />
        <FeedbackFooter articleUrl={url} editUrl={metadata.editUrl} />
      </div>
    );
  }

  renderFramed() {
    return (
      <div ref="content">
        {this.renderContent()}
      </div>
    );
  }

  renderFull() {
    let { metadata } = this.props;
    let { url } = this.props.currentRoute;

    return (
      <div className="docs-article">
        <div className="document">
          <NavigationBar currentSection={metadata.section} />
          <StickyContainer>
            <div className="js-doc-template container" style={{ marginBottom: '40px' }}>
              <div className="row">
                <div className="sidebar-container col-md-3">
                  <Sidebar section={metadata.section} maxDepth={3} url={url} />
                </div>
                <div ref="content" className="col-md-9">
                  {this.renderContent()}
                </div>
              </div>
            </div>
          </StickyContainer>
        </div>
      </div>
    );
  }

  render() {
    if (this.props.env['RENDER_MODE'] == 'framed') {
      return this.renderFramed();
    }
    else {
      return this.renderFull();
    }
  }

}

ArticlePage = connectToStores(ArticlePage, [ContentStore], (context, props) => {

  let {url} = props.currentRoute;
  let appStore = context.getStore(ApplicationStore);
  let contentStore = context.getStore(ContentStore);
  let navigationStore = context.getStore(NavigationStore);

  return {
    url,
    env: appStore.getEnvironmentVars(),
    title: appStore.getPageTitle(),
    description: appStore.getPageDescription(),
    html: contentStore.getContentHtml(url),
    metadata: navigationStore.getMetadata(url)
  };

});

export default ArticlePage;
