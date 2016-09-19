import React from 'react';
import {NavLink} from 'fluxible-router';

class ArticleLink extends React.Component {

  render() {
    let {article, children, onClick} = this.props;
    if (article.forceFullReload) {
      return <a href={article.url} onClick={onClick}>{children}</a>;
    }
    else {
      return <NavLink href={article.url} onClick={onClick}>{children}</NavLink>;
    }
  }

}

export default ArticleLink;
