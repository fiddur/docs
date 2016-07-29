import * as React from 'react'
import NavigationStore from '../stores/NavigationStore';
import {NavLink} from 'fluxible-router';
import {connectToStores} from 'fluxible-addons-react';

let SidebarItem = ({item, currentDepth, maxDepth}) => {

  let children = undefined;
  if (item.children && currentDepth < maxDepth) {
    let newDepth = currentDepth + 1;
    let items = item.children.map(child => (
      <SidebarItem key={child.href} item={child} currentDepth={newDepth} maxDepth={maxDepth} />
    ));
    children = <ul className={"sidebar-item-list sidebar-item-list-depth" + newDepth}>{items}</ul>;
  }

  let icon = undefined;
  if (item.icon) {
    icon = <i className={"sidebar-item-icon " + item.icon} />;
  }

  return (
    <li className={'sidebar-item sidebar-item-depth' + currentDepth}>
      <NavLink href={item.href}>
        {icon}
        <span className="sidebar-item-name">{item.name}</span>
      </NavLink>
      {children}
    </li>
  );

};

class Sidebar extends React.Component {

  render() {

    let {category, currentDocumentId, maxDepth} = this.props;

    let children = undefined;
    if (category && category.children) {
      children = category.children.map(category => (
        <SidebarItem key={category.href} item={category} currentDepth={0} maxDepth={maxDepth} />
      ));
    }

    return (
      <div className="sidebar">
        <ul className="sidebar-item-list sidebar-item-list-depth0">
          {children}
        </ul>
      </div>
    );

  }

}

Sidebar.defaultProps = {
  maxDepth: 2
}

Sidebar.contextTypes = {
  getStore: React.PropTypes.func
};

Sidebar = connectToStores(Sidebar, [NavigationStore], (context, props) => {
  return {
    category: context.getStore(NavigationStore).getCurrentCategory()
  };
});

export default Sidebar;
