import React from 'react';
import { navigateAction } from 'fluxible-router';
import { connectToStores } from 'fluxible-addons-react';
import ApplicationStore from '../stores/ApplicationStore';
import NavigationStore from '../stores/NavigationStore';
import ContentStore from '../stores/ContentStore';
import NavigationBar from './NavigationBar';
import Sidebar from './Sidebar';
import FeedbackSender from './FeedbackSender';
import setAnchorLinks from '../browser/anchorLinks';

class ArticlePage extends React.Component {

  componentDidMount() {
    this.executeEmbeddedScripts();
    //this.captureClicks();
    this.initClient();
    this.metrics();
  }

  componentDidUpdate(prevProps) {
    this.executeEmbeddedScripts();
    //this.captureClicks();
    //this.scrollToAnchor();
    this.initClient();
    if (prevProps.url !== this.props.url) {
      this.metrics();
    }
  }

  initClient() {
    if (typeof document !== 'undefined') {
      setAnchorLinks();
    }
  }

  metrics() {
    if (typeof document !== 'undefined') {
      this.context.trackPage();
    }
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
        $.globalEval(this.text || this.textContent || this.innerHTML || '');
      }
    });
  }

  renderContent() {
    let {html} = this.props;
    if (!html) {
      return (
        <section className="docs-content">
          <div className='auth0-spinner'>
            <div className='spinner'></div>
          </div>
        </section>
      );
    }
    else {
      return (
        <article className="docs-content" data-swiftype-name="body" data-swiftype-type="text" data-swiftype-index='true' dangerouslySetInnerHTML={{__html: html}} />
      );
    }
  }

  renderFramed() {
    return (
      <div ref="content">
        {this.renderContent()}
      </div>
    );
  }

  renderFull() {
    let {metadata} = this.props;
    return (
      <div className="docs-article">
        <div className="document">
          <NavigationBar />
          <div className="js-doc-template container">
            <div className="row">
              <div className="col-sm-3">
                <Sidebar sectionTitle={metadata.section} maxDepth={3} />
              </div>
              <div ref="content" className="col-sm-9">
                {this.renderContent()}
                <div className="article-interaction">
                  <FeedbackSender />
                  <a className="fixit" href={metadata.editUrl} target="_blank">
                    Suggestions? Typos? Edit this document on GitHub
                  </a>
                </div>
              </div>
            </div>
          </div>
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

ArticlePage.contextTypes = {
  trackPage: React.PropTypes.func.isRequired
};

ArticlePage = connectToStores(ArticlePage, [ContentStore], (context, props) => {

  let appStore = context.getStore(ApplicationStore);
  let contentStore = context.getStore(ContentStore);
  let navigationStore = context.getStore(NavigationStore);
  let url = contentStore.getCurrentContentUrl();
  
  return {
    env: appStore.getEnvironmentVars(),
    title: appStore.getPageTitle(),
    description: appStore.getPageDescription(),
    url,
    html: contentStore.getCurrentContentHtml(),
    metadata: navigationStore.getMetadata(url)
  };

});

export default ArticlePage;
