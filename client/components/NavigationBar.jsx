import * as React from 'react'
import NavigationStore from '../stores/NavigationStore';
import {NavLink} from 'fluxible-router';
import {connectToStores} from 'fluxible-addons-react';
import SearchBox from './SearchBox';

// TODO: Move this to a YAML file if necessary
let Sections = [
  {id: 'articles',    href: '/docs/overview',   text: 'Articles'},
  {id: 'sdks',        href: '/docs/sdks',       text: 'SDKs'},
  {id: 'quickstarts', href: '/docs/quickstart', text: 'QuickStarts'},
  {id: 'apis',        href: '/docs/api/info',   text: 'APIs'},
  {id: 'appliance',   href: '/docs/appliance',  text: 'Appliance'}
];

let NavigationTab = (section, currentSectionId) => {
  let {id, href, text} = section;
  let classes = ['nav-tab'];
  if (currentSectionId == id) classes.push('active');
  return (
    <li key={id} className={classes.join(' ')}>
      <NavLink href={href}>{text}</NavLink>
    </li>
  );
};

class NavigationBar extends React.Component {

  render() {

    let tabs = Sections.map(section => NavigationTab(section, this.props.currentSection));

    return (
      <div className="navigation-bar">
        <div className="container">
          <ul className="nav nav-tabs section-tabs">
            {tabs}
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
  return {
    currentSection: context.getStore(NavigationStore).getCurrentSection()
  };
});

export default NavigationBar;
