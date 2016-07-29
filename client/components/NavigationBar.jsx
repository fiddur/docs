import * as React from 'react'
import NavigationStore from '../stores/NavigationStore';
import {NavLink} from 'fluxible-router';
import {connectToStores} from 'fluxible-addons-react';
import SearchBox from './SearchBox';

let NavigationTab = (category, currentCategory) => {
  let {id, href, name} = category;
  let classes = ['nav-tab'];
  if (currentCategory && currentCategory.id == id) classes.push('active');
  return (
    <li key={id} className={classes.join(' ')}>
      <NavLink href={href}>{name}</NavLink>
    </li>
  );
};

class NavigationBar extends React.Component {

  render() {

    let {categories, currentCategory} = this.props;

    let tabs = undefined;
    if (categories) {
      tabs = categories.map(category => NavigationTab(category, currentCategory));
    }

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
  let store = context.getStore(NavigationStore);
  return {
    categories: store.getCategories(),
    currentCategory: store.getCurrentCategory()
  };
});

export default NavigationBar;
