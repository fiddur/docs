import * as React from 'react'
import NavigationStore from '../stores/NavigationStore';
import {NavLink} from 'fluxible-router';
import {connectToStores} from 'fluxible-addons-react';

let SidebarItem = ({article, currentDepth, maxDepth}) => {

  let children = undefined;
  if (article.children && currentDepth < maxDepth) {
    let newDepth = currentDepth + 1;
    let items = article.children.map(child => (
      <SidebarItem key={child.url} article={child} currentDepth={newDepth} maxDepth={maxDepth} />
    ));
    children = <ul className={"sidebar-item-list sidebar-item-list-depth" + newDepth}>{items}</ul>;
  }

  let icon = undefined;
  if (article.icon) {
    icon = <i className={"sidebar-item-icon " + article.icon} />;
  }

  return (
    <li className={'sidebar-item sidebar-item-depth' + currentDepth}>
      <NavLink href={article.url}>
        {icon}
        <span className="sidebar-item-name">{article.title}</span>
      </NavLink>
      {children}
    </li>
  );

};

class Sidebar extends React.Component {

  render() {

    let {articles, maxDepth} = this.props;

    let items = undefined;
    if (articles) {
      items = articles.map(article => (
        <SidebarItem key={article.url} article={article} currentDepth={0} maxDepth={maxDepth} />
      ));
    }

    return (
      <div className="sidebar">
        <ul className="sidebar-item-list sidebar-item-list-depth0">
          {items}
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
    articles: context.getStore(NavigationStore).getCurrentSidebarArticles()
  };
});

export default Sidebar;
