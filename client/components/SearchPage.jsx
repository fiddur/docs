import React from 'react';
import url from 'url';
import qs from 'querystring';
import NavigationBar from './NavigationBar';
import performSearchAction from '../action/performSearch';
import {connectToStores} from 'fluxible-addons-react';
import {navigateAction} from 'fluxible-router';
import SearchStore, {SearchResultState} from '../stores/SearchStore';
import SearchBox from './SearchBox';

let getCurrentSearchQuery = () => {
  if (typeof document === 'undefined') {
    return undefined;
  }
  else {
    let urlobj = url.parse(document.location.toString());
    return qs.parse(urlobj.query).q;
  }
};

let SearchSpinner = () => (
  <div className="auth0-spinner">
    <div className="spinner"></div>
    <div className="spinner-bg"></div>
  </div>
);

let SearchResult = (page, index) => (
  <div className="st-result row" key={index}>
    <div className="col-md-1 type-container">
      <span className="type docs">doc</span>
    </div>
    <div className="col-md-11">
      <h2 className="title"><a href={page.url} className="st-search-result-link">{page.title}</a></h2>
      <p><a href={page.url} dangerouslySetInnerHTML={{__html: page.highlight.body}}></a></p>
    </div>
  </div>
);

class SearchPage extends React.Component {

  componentDidMount() {
    if (typeof document !== 'undefined') {
      let {query} = this.props;
      if (query) {
        this.context.executeAction(performSearchAction, {query});
      }
    }
  }

  renderResultContent(result) {

    if (!result) {
      return <p>Please enter a query to search our documentation.</p>;
    }

    switch (result.state) {

      case SearchResultState.LOADING:
        return <SearchSpinner />;

      case SearchResultState.LOADED:
        if (result.response.record_count == 0) {
          return <p>No results found. Would you like to try another search term?</p>;
        }
        else {
          // TODO: Show result count, pagination, etc.
          return result.response.records.page.map(SearchResult);
        }

      case SearchResultState.ERROR:
        return <p>There was an error loading the search result. Please try again.</p>;

      default:
        throw new Error(`Unknown search state ${result.state}`);

    }
  }

  render() {

    let {query, result} = this.props;
    let title = result ? 'Search Results' : 'Search';

    return (
      <div className="document">
        <NavigationBar />
        <div className="container">
          <h1>{title}</h1>
          <SearchBox text={query} />
          <div className="search-results">
            {this.renderResultContent(result)}
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
  let query = getCurrentSearchQuery();
  let result = query ? store.getResult(query) : undefined;
  return {query, result};
});

export default SearchPage;
