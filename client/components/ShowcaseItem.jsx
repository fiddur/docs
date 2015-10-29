import React from 'react';

var ShowcaseItem = ({name, icon, href, description, baseUrl}) => (
  <a className="icon-scale col-sm-4 col-xs-6" href={baseUrl + href}>
    <i className={icon} />
    <div className="content">
      <strong>{name}</strong>
      <p>{description}</p>
    </div>
  </a>
);

export default ShowcaseItem;
