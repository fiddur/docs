import React from 'react';
import SearchBox from './SearchBox';
import initStickyNav from '../browser/stickyNav';
import { quickstartNavigationAction } from '../action/quickstartNavigationAction';

export default class TopNav extends React.Component {
  render() {
    return (
      <div className="navigation-bar docs-top-nav">
        <div className="wrapper">
          <div className="container">
            <Breadcrumbs {...this.props}  customNavigationAction={quickstartNavigationAction} />
            <SearchBox />
          </div>
        </div>
      </div>
    );
  }
}
