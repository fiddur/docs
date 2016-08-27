import * as React from 'react'
import NavigationStore from '../stores/NavigationStore';
import {NavLink} from 'fluxible-router';
import {connectToStores} from 'fluxible-addons-react';
import SearchBox from './SearchBox';

let NavigationTab = (section, currentSection) => {
  let {id, title, url} = section;
  let classes = ['nav-tab'];
  if (section.id == currentSection) classes.push('active');
  return (
    <li key={url} className={classes.join(' ')}>
      <NavLink href={url}>{title}</NavLink>
    </li>
  );
};

class NavigationBar extends React.Component {

  render() {

    let {sections, currentSection} = this.props;

    // Create a navigation tab for each section of the site.
    let tabs = undefined;
    if (sections) {
      tabs = sections.map(section => NavigationTab(section, currentSection));
    }

    return (
      <div className="navigation-bar">
        <div className="container">
          <ul className="nav nav-tabs section-tabs">
            {tabs}
          </ul>
          <SearchBox className="navigation-bar-search" />
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
    sections: store.getSections(),
    currentSection: store.getCurrentSection()
  };
});

export default NavigationBar;
