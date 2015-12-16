import React from 'react';
import SearchBox from './SearchBox';
import initStickyNav from '../browser/stickyNav';

export default class InlineNav extends React.Component {
  componentDidMount () {
    this.initClient();
  }
  componentDidUpdate() {
    this.initClient();
  }
  initClient(html) {
    if (typeof document !== 'undefined') {
      initStickyNav();
    }
  }
  render() {
    return (
      <div className="navigation-bar js-sticky-nav">
        <div className="wrapper">
          <div className="container">
            <ul className="list-inline">
              {this.props.categories.map((category) => (
                <li key={category.id}>
                  <a href={'#' + category.id}>{category.name}</a>
                </li>
              ))}
            </ul>
            <SearchBox />
          </div>
        </div>
      </div>

    );
  }
}
