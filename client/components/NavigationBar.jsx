import * as React from 'react'
import NavigationStore from '../stores/NavigationStore';
import {NavLink} from 'fluxible-router';
import {connectToStores} from 'fluxible-addons-react';
import NavigationSearchBox from './NavigationSearchBox';

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
  constructor() {
    super();

    this.state = {
      searchActive: false
    };

    this.searchIconCode = 471;
    this.closeIconCode = 489;
    this.handleIconClick = this.handleIconClick.bind(this);
  }
  handleIconClick() {
    this.setState({
      searchActive: !this.state.searchActive
    });
  }
  render() {
    let {sections, currentSection} = this.props;

    // Create a navigation tab for `each section of the site.
    let tabs = undefined;
    if (sections) {
      tabs = sections.map(section => NavigationTab(section, currentSection));
    }

    return (
      <div className={`navigation-bar ${this.state.searchActive ? 'is-search-active' : ''}`}>
        <div className="container">
          <NavigationSearchBox
            className="navigation-bar-search"
            handleIconClick = {this.handleIconClick}
            iconCode = { this.state.searchActive ? this.searchIconCode : this.closeIconCode }
            placeholder="Search for docs"
          />
          <ul className="navigation-bar-tabs nav nav-tabs">
            {tabs}
          </ul>
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
