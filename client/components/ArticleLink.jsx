import React from 'react';
import {NavLink} from 'fluxible-router';

class ArticleLink extends React.Component {

  render() {
    let {article, children} = this.props;
    if (article.forceFullReload) {
      return <a href={article.url}>{children}</a>;
    }
    else {
      return <NavLink href={article.url}>{children}</NavLink>;
    }
  }

}

export default ArticleLink;
