import React from 'react';
import { connectToStores } from 'fluxible-addons-react';
import DocumentStore from '../stores/DocumentStore';
import NavigationBar from './NavigationBar';
import Sidebar from './Sidebar';

class ArticlePage extends React.Component {

  render() {
    return (
      <div className="document">
        <NavigationBar />
        <div className="js-doc-template container">
          <div className="row">
            <div className="col-sm-3">
              <Sidebar maxDepth={2} />
            </div>
            <div className="col-sm-9">
              <section className="docs-content" dangerouslySetInnerHTML={{__html: this.props.html}} />
            </div>
          </div>
        </div>
      </div>
    );
  }

}

ArticlePage = connectToStores(ArticlePage, [DocumentStore], (context, props) => {
  return {
    html: context.getStore(DocumentStore).getCurrentDocumentHtml()
  };
});

export default ArticlePage;
