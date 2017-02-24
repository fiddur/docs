import React, { PropTypes } from 'react';
import { NavLink } from 'fluxible-router';
import { parse } from 'url';

const ArticleLink = ({ article, children }) => {

  let url;
  let icon;
  const classes = [];

  if (article.external) {
    classes.push('arrow-item');
    url = article.url;
    icon = <i className="icon-budicon-519" />;
  } else {
    url = parse(article.url).pathname;
  }

  return (
    <NavLink className={classes.join(' ')} href={url} followLink={article.forceFullReload}>
      {children}
      {icon}
    </NavLink>
  );
};

ArticleLink.propTypes = {
  article: PropTypes.object,
  children: PropTypes.node
};

export default ArticleLink;
