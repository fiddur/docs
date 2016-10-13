import React from 'react';
import { NavLink } from 'fluxible-router';

class ArticleLink extends React.Component {

  render() {
    let { article, children } = this.props;
    if (article.forceFullReload) {
      return (
        <a href={article.url} className={`${article.external ? 'arrow-item' : ''}`} >
          {children}
          { article.external && <i className="icon-budicon-519" />}
        </a>
      );
    }

    return (
      <NavLink href={article.url} className={`${article.external ? 'arrow-item' : ''}`}>
        {children}
        { article.external && <i className="icon-budicon-519" />}
      </NavLink>
    );
  }

}

export default ArticleLink;
