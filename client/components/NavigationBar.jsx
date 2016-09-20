import * as React from 'react';
import url from 'url';
import qs from 'querystring';
import { connectToStores } from 'fluxible-addons-react';
import { NavLink } from 'fluxible-router';
import NavigationStore from '../stores/NavigationStore';
import NavigationSearchBox from './NavigationSearchBox';

let NavigationTab = (section, currentSection) => {
  let { id, title, url } = section;
  let classes = ['nav-tab'];
  if (section.id == currentSection) classes.push('active');
  return (
    <li key={url} className={classes.join(' ')}>
      <NavLink href={url}>{title}</NavLink>
    </li>
  );
};

const getCurrentSearchQuery = () => {
  if (typeof document === 'undefined') return undefined;

  const urlobj = url.parse(document.location.toString());
  return qs.parse(urlobj.query).q;
};

class NavigationBar extends React.Component {
  constructor(props) {
    super(props);

    this.searchIconCode = 471;
    this.closeIconCode = 489;
    this.handleIconClick = this.handleIconClick.bind(this);
    this.query = getCurrentSearchQuery();

    this.state = {
      searchActive: false
    };
  }
  handleIconClick() {
    this.setState({
      searchActive: !this.state.searchActive
    });
  }
  render() {
    const { sections, currentSection } = this.props;

    // Create a navigation tab for `each section of the site.
    let tabs;
    if (sections) {
      tabs = sections.map(section => NavigationTab(section, currentSection));
    }

    return (
      <div className={`navigation-bar ${this.state.searchActive ? 'is-search-active' : ''}`}>
        <div className="container">
          <NavigationSearchBox
            className="navigation-bar-search"
            text=""
            handleIconClick={this.handleIconClick}
            iconCode={this.state.searchActive ? this.searchIconCode : this.closeIconCode}
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
