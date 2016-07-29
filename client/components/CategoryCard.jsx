import React from 'react';
import _ from 'lodash';
import {NavLink} from 'fluxible-router';

let ArticleLink = ({article}) => (
  <li className="category-card-link">
    <NavLink href={article.href}>{article.name}</NavLink>
  </li>
);

class CategoryCard extends React.Component {

  render() {

    let {category, articleCount} = this.props;

    let articles = _.take(category.articles, articleCount);
    let links = articles.map(article => (
      <ArticleLink key={article.href} article={article} />
    ));

    return (
      <div className="category-card-container col-sm-4">
        <div className="category-card">
          <div className="category-card-header">
            <i className={category.icon + ' ' + category.color} />
            <NavLink className="category-card-name" href={category.href}>{category.name}</NavLink>
          </div>
          <div className="category-card-description">{category.description}</div>
          <ul className="category-card-links">
            {links}
          </ul>
          <NavLink className="category-card-more-link" href={category.href}>More</NavLink>
        </div>
      </div>
    );
    
  }

};

CategoryCard.defaultProps = {
  articleCount: 3
};

export default CategoryCard;
