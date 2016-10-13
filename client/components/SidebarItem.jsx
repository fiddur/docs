import * as React from 'react';
import ArticleLink from './ArticleLink';

const SidebarItem = ({ article, currentDepth, maxDepth, handleOnClick }) => {
  let children;
  let icon;

  if (article.children && currentDepth < maxDepth) {
    const newDepth = currentDepth + 1;
    const items = article.children.map(child => (
      <SidebarItem
        handleOnClick={handleOnClick} key={child.url} article={child}
        currentDepth={newDepth} maxDepth={maxDepth}
      />
    ));
    children = <ul className={`sidebar-item-list sidebar-item-list-depth${newDepth}`}>{items}</ul>;
  }

  if (article.icon) {
    icon = <i className={`sidebar-item-icon ${article.icon}`} />;
  }

  return (
    <li
      className={`sidebar-item sidebar-item-depth${currentDepth} ${article.expanded ? 'expanded' : ''}`}
      onClick={handleOnClick}
    >
      <ArticleLink article={article}>
        <span className="sidebar-item-name">{article.title}</span>
      </ArticleLink>
      {children}
    </li>
  );
};

SidebarItem.propTypes = {
  article: React.PropTypes.object.isRequired,
  handleOnClick: React.PropTypes.func.isRequired,
  currentDepth: React.PropTypes.number,
  maxDepth: React.PropTypes.number
};

export default SidebarItem;
