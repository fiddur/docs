import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { navigateAction } from 'fluxible-router';
import { connectToStores } from 'fluxible-addons-react';
import { StickyContainer, Sticky } from 'react-sticky';
import { get } from 'lodash';
import ApplicationStore from '../stores/ApplicationStore';
import NavigationStore from '../stores/NavigationStore';
import ContentStore from '../stores/ContentStore';
import NavigationBar from './NavigationBar';
import Sidebar from './Sidebar';
import FeedbackFooter from './FeedbackFooter';
import setAnchorLinks from '../browser/anchorLinks';
import Spinner from './Spinner';
import initSampleBox from '../browser/sampleBox';
import TocBar from './TocBar';

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

    if (get(this.props, 'content.meta.toc')) this.initTOC();
  }

  componentDidUpdate(prevProps) {
    this.executeEmbeddedScripts();
    // this.captureClicks();
    // this.scrollToAnchor();
    setAnchorLinks();
    initSampleBox();

    // Initialize TOC again if url changes
    if (this.props.url !== prevProps.url) this.tocUrlChange = true;
    if (get(this.props, 'content.meta.toc') && this.tocUrlChange) {
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
    const { toc, title } = this.props.content.meta;
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
    let { url, content } = this.props;

    // If the document's content hasn't been loaded yet, display a spinner.
    if (!content || !content.html || !content.meta) {
      return (<Spinner />);
    }

    let classes = ['docs-content']
    if (content.meta) classes = classes.concat(content.meta.classes);

    return (
      <div>
        <article
          className={classes.join(' ')}
          data-swiftype-name="body"
          data-swiftype-type="text"
          data-swiftype-index="true"
          dangerouslySetInnerHTML={{ __html: content.html }}
        />
        <FeedbackFooter articleUrl={url} editUrl={content.meta.editUrl} />
      </div>
    );
  }

  render() {
    const { content, sidebarArticles } = this.props;
    const { url } = this.props.currentRoute;

    // TODO: Sidebar needs to not update until all this is ready again
    const section = (content && content.meta) ? content.meta.section : undefined;

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

ArticlePage = connectToStores(ArticlePage, [ContentStore], (context, props) => {

  let { url } = props.currentRoute;
  let appStore = context.getStore(ApplicationStore);
  let contentStore = context.getStore(ContentStore);
  let navigationStore = context.getStore(NavigationStore);

  const content = contentStore.getContent(url);

  let sidebarArticles = [];
  if (content && content.meta) {
    sidebarArticles = navigationStore.getSidebarArticles(content.meta.section);
  }

  return {
    url,
    env: appStore.getEnvironmentVars(),
    content,
    sidebarArticles
  };
});

export default ArticlePage;
