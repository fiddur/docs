import * as React from 'react'
import NavigationStore from '../stores/NavigationStore';
import {NavLink} from 'fluxible-router';
import {connectToStores} from 'fluxible-addons-react';
import SearchBox from './SearchBox';

class NavigationBar extends React.Component {

  render() {

    // TODO: Determine active section based on document that's displayed?

    return (
      <div className="navigation-bar">
        <div className="container">
          <ul className="nav nav-tabs section-tabs">
            <li className="active"><NavLink href="#">Overview</NavLink></li>
            <li><NavLink href="/">SDKs</NavLink></li>
            <li><NavLink href="/">QuickStarts</NavLink></li>
            <li><NavLink href="/">APIs</NavLink></li>
            <li><NavLink href="/">Appliance</NavLink></li>
          </ul>
          <SearchBox />
        </div>
      </div>
    );
  }

}

NavigationBar.contextTypes = {
  getStore: React.PropTypes.func
};

NavigationBar = connectToStores(NavigationBar, [NavigationStore], (context, props) => {
  let store = context.getStore(NavigationStore);
  return {
    categories: store.getCategories()
  };
});

export default NavigationBar;
