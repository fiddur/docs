import React from 'react';
import { navigateAction } from 'fluxible-router';
import { connectToStores } from 'fluxible-addons-react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { StickyContainer, Sticky } from 'react-sticky';
import ApplicationStore from '../stores/ApplicationStore';
import NavigationStore from '../stores/NavigationStore';
import ContentStore from '../stores/ContentStore';
import Spinner from './Spinner';

const languages = [
  { key: 'http', name: 'HTTP' },
  { key: 'shell', name: 'Shell' },
  { key: 'javascript', name: 'JavaScript' },
  { key: 'csharp', name: 'C#' }
];

class AuthApiPage extends React.Component {

  componentDidMount() {
    const languageKeys = [];
    languages.map((language) =>
      languageKeys.push(language.key)
    );
    window.initApiExplorer(languageKeys);
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { content } = nextProps;
    if (!content || !content.html || !content.meta) {
      return false;
    }
    return PureRenderMixin.shouldComponentUpdate(this, nextProps, nextState);
  }

  renderContent() {
    const { content } = this.props;

    // If the document's content hasn't been loaded yet, display a spinner.
    if (!content || !content.html || !content.meta) {
      return (<Spinner />);
    }

    return <div dangerouslySetInnerHTML={{ __html: content.html }} />;
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
              <Sticky topOffset={-43} stickyClassName={'sticky lang-mobile-sticky'}>
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
              </Sticky>
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
  content: React.PropTypes.object,
  currentRoute: React.PropTypes.object
};

AuthApiPage = connectToStores(AuthApiPage, [ContentStore, NavigationStore], (context, props) => {
  const { url } = props.currentRoute;
  const appStore = context.getStore(ApplicationStore);
  const contentStore = context.getStore(ContentStore);
  const navigationStore = context.getStore(NavigationStore);
  return {
    url,
    env: appStore.getEnvironmentVars(),
    content: contentStore.getContent(url)
  };
});

export default AuthApiPage;
