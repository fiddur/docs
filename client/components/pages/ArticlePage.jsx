import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { navigateAction } from 'fluxible-router';
import { connectToStores } from 'fluxible-addons-react';
import { StickyContainer, Sticky } from 'react-sticky';
import { get } from 'lodash';
import ApplicationStore from '../../stores/ApplicationStore';
import DocumentStore from '../../stores/DocumentStore';
import NavigationStore from '../../stores/NavigationStore';
import setAnchorLinks from '../../browser/anchorLinks';
import initSampleBox from '../../browser/sampleBox';
import NavigationBar from '../NavigationBar';
import FeedbackFooter from '../FeedbackFooter';
import Sidebar from '../Sidebar';
import Spinner from '../Spinner';
import TocBar from '../TocBar';

class ArticlePage extends React.Component {

  constructor() {
    super();

    this.tocUrlChange = false;
    this.initTOC = this.initTOC.bind(this);
  }

  componentDidMount() {
    this.executeEmbeddedScripts();
    // this.captureClicks();
    setAnchorLinks();
    initSampleBox();

    if (get(this.props, 'doc.meta.toc')) this.initTOC();
  }

  componentDidUpdate(prevProps) {
    this.executeEmbeddedScripts();
    // this.captureClicks();
    // this.scrollToAnchor();
    setAnchorLinks();
    initSampleBox();

    // Initialize TOC again if url changes
    if (this.props.url !== prevProps.url) this.tocUrlChange = true;
    if (get(this.props, 'doc.meta.toc') && this.tocUrlChange) {
      this.initTOC();
      this.tocUrlChange = false;
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

  initTOC() {
    const { toc, title } = this.props.doc.meta;
    const docsContainer = $('.docs-content');

    docsContainer.addClass('docs-with-toc');
    docsContainer.find('h1.anchor-heading').wrap('<div class="title-toc-container"></div>');
    docsContainer.find('.title-toc-container').append('<div id="toc"></div>');

    // https://css-tricks.com/hash-tag-links-padding/
    // Add a <span> element before each title to make padding for the fixed top bar
    $.each(docsContainer.find('.anchor-heading:not(h1)'), (index, elem) => {
      const titleID = $(elem).attr('id');
      $(elem).before(`<span id="${titleID}" class="anchor-heading-pointer"></span>`);
    });

    ReactDOM.render(
      <TocBar title={title} />,
      document.getElementById('toc')
    );
  }

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
    let { url, doc } = this.props;

    // If the document hasn't been loaded yet, display a spinner.
    if (!doc || !doc.html || !doc.meta) {
      return (<Spinner />);
    }

    let classes = ['docs-content'];
    if (doc.meta) classes = classes.concat(doc.meta.classes);

    return (
      <div>
        <article
          className={classes.join(' ')}
          data-swiftype-name="body"
          data-swiftype-type="text"
          data-swiftype-index="true"
          dangerouslySetInnerHTML={{ __html: doc.html }}
        />
        <FeedbackFooter articleUrl={url} editUrl={doc.meta.editUrl} />
      </div>
    );
  }

  render() {
    const { doc, sidebarArticles } = this.props;
    const { url } = this.props.currentRoute;

    // TODO: Sidebar needs to not update until all this is ready again
    const section = (doc && doc.meta) ? doc.meta.section : undefined;

    return (
      <div className="docs-article">
        <div className="document">
          <NavigationBar currentSection={section} />
          <StickyContainer>
            <div className="js-doc-template container" style={{ marginBottom: '40px' }}>
              <div className="row">
                <div className="sidebar-container col-md-3">
                  <Sidebar items={sidebarArticles} section={section} maxDepth={3} url={url} />
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
}

ArticlePage.propTypes = {
  url: PropTypes.string
};

ArticlePage = connectToStores(ArticlePage, [ApplicationStore, DocumentStore, NavigationStore], (context, props) => {
  const appStore = context.getStore(ApplicationStore);
  const docStore = context.getStore(DocumentStore);
  const navigationStore = context.getStore(NavigationStore);

  const { url } = props.currentRoute;
  const doc = docStore.getDocument(url);

  let sidebarArticles = [];
  if (doc && doc.meta) {
    sidebarArticles = navigationStore.getSidebarArticles(doc.meta.section);
  }

  return {
    url,
    doc,
    sidebarArticles
  };
});

export default ArticlePage;
