import React from 'react';
import SearchBox from './SearchBox';
import initStickyNav from '../browser/stickyNav';

export default class TopNav extends React.Component {
  render() {
    return (
      <div className="navigation-bar docs-top-nav">
        <div className="wrapper">
          <div className="container">
            <ul className="list-inline">
              <li className="is-active"><a href="/docs">Docs</a></li>
              <li><a href="/docs/product">Product</a></li>
              <li><a href="/docs/quickstart">Quickstart</a></li>
              <li><a href="/docs/libraries">Libraries & SDKs</a></li>
            </ul>
            <SearchBox />
          </div>
        </div>
      </div>
    );
  }
}
