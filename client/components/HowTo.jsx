import React from 'react';

var HowTo = ({name, icon, href, description}) => (
  <a className="how-to" href={href}>
    <div className="content">
      <i className={icon} />
      <div className="title">{name}</div>
      <div className="description">{description}</div>
    </div>
  </a>
);

export default HowTo;
