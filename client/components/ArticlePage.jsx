import React from 'react';
import { navigateAction } from 'fluxible-router';
import { connectToStores } from 'fluxible-addons-react';
import ContentStore from '../stores/ContentStore';
import NavigationBar from './NavigationBar';
import Sidebar from './Sidebar';

class ArticlePage extends React.Component {

  componentDidMount() {
    this.captureClicks();
  }

  componentDidUpdate() {
    this.captureClicks();
    this.scrollToAnchor();
  }

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

  render() {

    let {html} = this.props;

    let content = undefined;
    if (!html) {
      content = (
        <section className="docs-content">
          <div className='auth0-spinner'>
            <div className='spinner'></div>
          </div>
        </section>
      );
    }
    else {
      content = (
        <section className="docs-content" dangerouslySetInnerHTML={{__html: html}} />
      );
    }

    return (
      <div className="document">
        <NavigationBar />
        <div className="js-doc-template container">
          <div className="row">
            <div className="col-sm-3">
              <Sidebar maxDepth={2} />
            </div>
            <div ref="content" className="col-sm-9">
              {content}
            </div>
          </div>
        </div>
      </div>
    );
  }

}

ArticlePage = connectToStores(ArticlePage, [ContentStore], (context, props) => {
  return {
    html: context.getStore(ContentStore).getCurrentContentHtml()
  };
});

export default ArticlePage;
