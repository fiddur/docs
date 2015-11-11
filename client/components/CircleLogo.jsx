import React from 'react';

var CircleLogo = ({name, slug, href, icon}) => (
  <a className="circle-logo" href={href} data-name={slug}>
    <div className={'logo' + (icon || '')}></div>
    <div className="title">{name}</div>
  </a>
);

export default CircleLogo;
