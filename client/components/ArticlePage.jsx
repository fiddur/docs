import React from 'react';
import { navigateAction } from 'fluxible-router';
import { connectToStores } from 'fluxible-addons-react';
import ContentStore from '../stores/ContentStore';
import NavigationBar from './NavigationBar';
import Sidebar from './Sidebar';

class ArticlePage extends React.Component {

  /*
  componentDidMount() {
    $('a', this.refs.content).click(evt => {
      let {href} = evt.currentTarget;
      let location = window.location;
      let origin = location.origin || (location.protocol + '//' + location.host);
      if (href.indexOf(origin) == 0) {
        evt.preventDefault();
        let url = href.substring(origin.length) || '/'
        context.executeAction(navigateAction, {url});
        return false;
      }
    });
  }
  */

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
              <section ref="content" className="docs-content" dangerouslySetInnerHTML={{__html: this.props.html}} />
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
