import React from 'react';

var HowTo = ({name, icon, href, description, baseUrl}) => (
  <a className="how-to" href={baseUrl + href}>
    <div className="content">
      <i className={icon} />
      <div className="title">{name}</div>
      <div className="description">{description}</div>
    </div>
  </a>
);

export default HowTo;
