import React from 'react';

var SearchBox = () => (
  <form id="search" role="search" action="/docs/search" autoComplete="off">
    <div className="form-group search-control">
      <i className="icon-budicon-489" />
      <input id="search-input" type="text" placeholder="Search for docs" name="q" className="search-input form-control"/>
    </div>
  </form>
);

export default SearchBox;
