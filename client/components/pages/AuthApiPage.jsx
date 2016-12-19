import React, { PropTypes } from 'react';
import { navigateAction } from 'fluxible-router';
import { connectToStores } from 'fluxible-addons-react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { StickyContainer, Sticky } from 'react-sticky';
import ApplicationStore from '../../stores/ApplicationStore';
import DocumentStore from '../../stores/DocumentStore';
import NavigationStore from '../../stores/NavigationStore';
import Spinner from '../Spinner';
import ResponsiveSticky from '../ResponsiveSticky';

const languages = [
  { key: 'http', name: 'HTTP' },
  { key: 'shell', name: 'Shell' },
  { key: 'javascript', name: 'JavaScript' }
];

class AuthApiPage extends React.Component {

  componentDidMount() {
    window.initApiExplorer(languages);
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { doc } = nextProps;
    if (!doc || !doc.html || !doc.meta) {
      return false;
    }
    return PureRenderMixin.shouldComponentUpdate(this, nextProps, nextState);
  }

  renderContent() {
    const { doc } = this.props;

    // If the document hasn't been loaded yet, display a spinner.
    if (!doc || !doc.html || !doc.meta) {
      return <Spinner />;
    }

    return <div dangerouslySetInnerHTML={{ __html: doc.html }} />;
  }

  render() {
    return (
      <StickyContainer>
        <section
          className="content api-explorer"
          data-swiftype-name="body"
          data-swiftype-type="text"
          data-swiftype-index="true"
        >
          <div className="api-sidebar tocify-wrapper">
            <div className="sticky-nav-placeholder">
              <Sticky>
                <div className="sticky-nav">
                  <div className="sticky-nav-selected">
                    <span>Menu</span>
                    <i className="icon-budicon-460" />
                  </div>
                  <div id="toc">
                    <div className="title">Authentication API</div>
                  </div>
                </div>
              </Sticky>
            </div>
          </div>
          <div className="page-wrapper">
            <div className="dark-box" />
            <div className="lang-selector-container">
              <ResponsiveSticky
                mobileOffset={-43}
                desktopOffset={0}
                stickyClassName={'sticky lang-mobile-sticky'}
              >
                <div className="lang-selector">
                  <div className="lang-selector-selected">
                    <span className="language-label">Language:</span>
                    <span className="language js-selected-language" />
                    <i className="icon-budicon-460" />
                  </div>
                  {languages.map((language) => (
                    <a
                      href={`#${language.key}`} key={language.key}
                      data-language-name={language.key}
                    >
                      {language.name}
                    </a>
                  ))}
                </div>
              </ResponsiveSticky>
            </div>
            <div className="api-content">
              {this.renderContent()}
            </div>
          </div>
        </section>
      </StickyContainer>
    );
  }
}

AuthApiPage.propTypes = {
  doc: React.PropTypes.object,
  currentRoute: React.PropTypes.object
};

AuthApiPage = connectToStores(AuthApiPage, [DocumentStore, NavigationStore], (context, props) => {
  const { url } = props.currentRoute;
  const doc = context.getStore(DocumentStore).getDocument(url);
  return { doc };
});

export default AuthApiPage;
