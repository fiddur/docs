import * as React from 'react';
import url from 'url';
import qs from 'querystring';
import { connectToStores } from 'fluxible-addons-react';
import { NavLink, navigateAction } from 'fluxible-router';
import NavigationStore from '../stores/NavigationStore';
import NavigationSearchBox from './NavigationSearchBox';
import performSearchAction from '../action/performSearch';

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

class NavigationBar extends React.Component {
  constructor(props) {
    super(props);

    this.searchIconCode = 471;
    this.closeIconCode = 489;

    this.handleTextChange = this.handleTextChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleIconClick = this.handleIconClick.bind(this);

    this.state = {
      searchActive: !!props.query,
      searchBoxText: props.query ? props.query : ''
    };
  }

  // Search box methods
  handleIconClick() {
    const newSearchState = !this.state.searchActive;

    this.setState({
      searchActive: newSearchState,
      searchBoxText: !newSearchState ? '' : this.state.searchBoxText
    });
  }

  handleTextChange(e) {
    this.setState({ searchBoxText: e.target.value });
  }

  handleSubmit(e) {
    e.preventDefault();
    const query = this.state.searchBoxText;
    this.context.executeAction(performSearchAction, { query });
    this.context.executeAction(navigateAction, { url: `/docs/search?q=${query}` });
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
            text={this.state.searchBoxText}
            placeholder="Search for docs"
            iconCode={this.state.searchActive ? this.searchIconCode : this.closeIconCode}
            handleTextChange={this.handleTextChange}
            handleSubmit={this.handleSubmit}
            handleIconClick={this.handleIconClick}
            ref={(e) => { this.input = e; }}
            searchActive={this.state.searchActive}
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
  getStore: React.PropTypes.func,
  executeAction: React.PropTypes.func
};

NavigationBar.propTypes = {
  query: React.PropTypes.string
};


NavigationBar = connectToStores(NavigationBar, [NavigationStore], (context, props) => {
  let store = context.getStore(NavigationStore);
  return {
    sections: store.getSections()
  };
});

export default NavigationBar;
