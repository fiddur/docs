import React from 'react';
import url from 'url';
import qs from 'querystring';
import NavigationBar from './NavigationBar';
import performSearchAction from '../action/performSearch';
import {connectToStores} from 'fluxible-addons-react';
import SearchStore from '../stores/SearchStore';


class SearchPage extends React.Component {

  componentDidMount() {
    if (typeof document !== 'undefined') {
      var result = qs.parse(url.parse(document.location.toString()).query);
      if (result && result['q']) {
        this.context.executeAction(performSearchAction, { query: result['q'] });
      }
    }
  }

  getResultContent() {
    var results = this.props.results;
    if (!results.records || !results.records.page) {
      return (
        <div className="auth0-spinner">
          <div className="spinner"></div>
          <div className="spinner-bg"></div>
        </div>
      );
    } else if (results.record_count === 0) {
      return (
        <p>No results found.</p>
      );
    } else {
      let items = results.records.page.map((page, i) => {
        return (
          <div className="st-result row" key={i}>
            <div className="col-md-1 type-container">
              <span className="type docs">doc</span>
            </div>
            <div className="col-md-11">
              <h2 className="title"><a href={page.url} className="st-search-result-link">{page.title}</a></h2>
              <p><a href={page.url} dangerouslySetInnerHTML={{__html: page.highlight.body}}></a></p>
            </div>
          </div>
        );
      });

      return (
        <div>
          {items}
        </div>
      )
    }
  }

  render() {
    return (
      <div className="document">
        <NavigationBar />
        <div className="container">
          <h1>Search Results</h1>
          <p>Type for any term on the top right search box and submit so we can help you find what you need to get started.</p>
          <div className="search-results">
            {this.getResultContent()}
          </div>
        </div>
      </div>
    );
  }

}

SearchPage.contextTypes = {
  getStore: React.PropTypes.func,
  executeAction: React.PropTypes.func,
};

SearchPage = connectToStores(SearchPage, [SearchStore], (context, props) => {
  let store = context.getStore(SearchStore);
  return {
    results: store.getResults()
  };
});

export default SearchPage;
