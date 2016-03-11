import React from 'react';
import ShowcaseItem from './ShowcaseItem';
import {NavLink} from 'fluxible-router';

var ProductSection = ({category, top}) => (
  <div className="showcase">
    <div className="container">
      <div className="row">
        {(top ? category.links.slice(0, top) : category.links).map((link, i) => (
          <ShowcaseItem key={i} {...link} />
        ))}
      </div>
    </div>
  </div>
);

export default ProductSection;
