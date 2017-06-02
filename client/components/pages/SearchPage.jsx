import React from 'react';
import url from 'url';
import qs from 'querystring';
import { connectToStores } from 'fluxible-addons-react';
import { RouteStore, navigateAction } from 'fluxible-router';
import NavigationBar from '../NavigationBar';
import performSearchAction from '../../action/performSearch';
import searchClickthroughAction from '../../action/searchClickthroughAction';
import SearchStore, { SearchResultState } from '../../stores/SearchStore';
import SearchBox from '../SearchBox';

const SearchSpinner = () => (
  <div className="auth0-spinner">
    <div className="spinner" />
    <div className="spinner-bg" />
  </div>
);

class SearchResult extends React.Component {

  handleClick() {
    this.context.executeAction(searchClickthroughAction, {query: this.props.query, id: this.props.page.id })
  }

  render() {
    let page = this.props.page;
    var boundClick = this.handleClick.bind(this);

    return (
      <div className="st-result row">
        <div className="col-md-1 type-container">
          <span className="type docs">doc</span>
        </div>
        <div className="col-md-11">
          <h2 className="title"><a onClick={boundClick} href={page.url} className="st-search-result-link">{page.title}</a></h2>
          <p><a onClick={boundClick} href={page.url} dangerouslySetInnerHTML={{ __html: page.highlight.body }}></a></p>
        </div>
      </div>
    );
  }

}

SearchResult.contextTypes = {
  executeAction: React.PropTypes.func,
};

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
      } else {
        // TODO: Show result count, pagination, etc.
        return result.response.records.page.map((page, i) => {
          //var boundClick = this.handleClick.bind(this, page);
          return (
            <SearchResult page={page} query={result.response.info.page.query} key={i} />
          );
        });
      }

    case SearchResultState.ERROR:
      return <p>There was an error loading the search result. Please try again.</p>;

    default:
      throw new Error(`Unknown search state ${result.state}`);

    }
  }

  render() {

    let { query, result } = this.props;
    let title = result ? 'Search Results' : 'Search';

    return (
      <div className="document">
        <NavigationBar currentSection="articles" query={query} />
        <div className="container">
          <h1>{title}</h1>
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
  executeAction: React.PropTypes.func
};

SearchPage = connectToStores(SearchPage, [SearchStore, RouteStore], (context, props) => {
  const store = context.getStore(SearchStore);
  const urlStore = context.getStore(RouteStore);
  const query = urlStore.getCurrentRoute().query.q;
  const result = query ? store.getResult(query) : undefined;
  return { query, result };
});

export default SearchPage;