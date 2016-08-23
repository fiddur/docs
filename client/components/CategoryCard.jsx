import React from 'react';
import _ from 'lodash';
import {NavLink} from 'fluxible-router';
import ArticleLink from './ArticleLink';

class CategoryCard extends React.Component {

  render() {

    let {category, articleCount} = this.props;

    let articles = _.take(category.articles, articleCount);
    let links = articles.map(article => (
      <li key={article.url} className="category-card-link">
        <ArticleLink article={article}>{article.title}</ArticleLink>
      </li>
    ));

    return (
      <div className="category-card-container col-sm-4">
        <div className="category-card">
          <div className="category-card-header">
            <i className={category.icon + ' ' + category.color} />
            <NavLink className="category-card-name" href={category.url}>{category.title}</NavLink>
          </div>
          <div className="category-card-description">{category.description}</div>
          <ul className="category-card-links">
            {links}
          </ul>
          <NavLink className="category-card-more-link" href={category.url}>More</NavLink>
        </div>
      </div>
    );
    
  }

};

CategoryCard.defaultProps = {
  articleCount: 3
};

export default CategoryCard;
