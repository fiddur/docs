import React from 'react';

class SearchBox extends React.Component {
  render() {
    return (
      <form id="search" role="search" action="/search" autoComplete="off">
        <div className="form-group search-control"><i className="icon-budicon-489"></i>
          <input id="search-input-2" type="text" placeholder="Search for docs" name="q" className="search-input form-control"/>
        </div>
      </form>
    );
  }
}

export default SearchBox;
