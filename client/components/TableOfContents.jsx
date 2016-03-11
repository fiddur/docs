import _ from 'lodash';
import React from 'react';

var TableOfContents = ({categories}) => {

  var linkGroup = function(id, showDescriptions) {
    var category = _.find(categories, { id: id});

    var categoryLink = function(link, i) {
      if (showDescriptions) {
        return (
          <li key={i}>
            <a href={link.href}>{link.name}</a>
            <span>{link.description}</span>
          </li>
        );
      } else {
        return (
          <li key={i}>
            <a href={link.href}>{link.name}</a>
          </li>
        );
      }
    }

    return (
      <div>
        <h3>{category.name}</h3>
        <ul className="list-unstyled">
          {category.links.map(categoryLink)}
        </ul>
      </div>
    );
  };

  return (
    <section className="wrapper table-of-contents section-product" id="toc">
      <div className="container">
        <div className="row">
          <div className="col-md-4">
            {linkGroup('start')}
            {/*{linkGroup('platform')}*/}
            {linkGroup('web-framework')}
          </div>
          <div className="col-md-4">
            {/*{linkGroup('dev-center')}
            {linkGroup('web-framework')}*/}
            {linkGroup('sdk')}
            {linkGroup('plugin')}
          </div>
          <div className="col-md-4">
            {linkGroup('ui-component', true)}
            {linkGroup('how-to')}
          </div>
        </div>
      </div>
    </section>
  );
}



export default TableOfContents;
