import React from 'react';
import { navigateAction } from 'fluxible-router';
import { connectToStores } from 'fluxible-addons-react';
import ApplicationStore from '../stores/ApplicationStore';
import ContentStore from '../stores/ContentStore';
import NavigationBar from './NavigationBar';
import Sidebar from './Sidebar';
import setAnchorLinks from '../browser/anchorLinks';

class ArticlePage extends React.Component {

  componentDidMount() {
    this.executeEmbeddedScripts();
    //this.captureClicks();
    this.initClient();
  }

  componentDidUpdate() {
    this.executeEmbeddedScripts();
    //this.captureClicks();
    //this.scrollToAnchor();
    this.initClient();
  }

  initClient() {
    if (typeof document !== 'undefined') {
      setAnchorLinks();
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
        <section className="docs-content" data-swiftype-name="body" data-swiftype-type="text" dangerouslySetInnerHTML={{__html: html}} />
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
    return (
      <div className="document">
        <NavigationBar />
        <div className="js-doc-template container">
          <div className="row">
            <div className="col-sm-3">
              <Sidebar maxDepth={2} />
            </div>
            <div ref="content" className="col-sm-9">
              {this.renderContent()}
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

ArticlePage = connectToStores(ArticlePage, [ContentStore], (context, props) => {
  let appStore = context.getStore(ApplicationStore);
  let contentStore = context.getStore(ContentStore);
  return {
    env: appStore.getEnvironmentVars(),
    title: appStore.getPageTitle(),
    description: appStore.getPageDescription(),
    html: contentStore.getCurrentContentHtml()
  };
});

export default ArticlePage;
