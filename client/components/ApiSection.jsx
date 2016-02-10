import React from 'react';
import {NavLink} from 'fluxible-router';

var ApiSection = ({category}) => {

  var boxContainer = (item, icon) => (
    <div className="col-xs-6 col-md-4">
      <a className="icon-scale api-link" href={item.href}>
        <i className={icon} />
        <strong>{item.name}</strong>
        <p>{item.description}</p>
      </a>
    </div>
  );

  return (
    <div className="api-docs">
      <div className="container">
        <div className="row">
          {boxContainer(category.sections['auth-endpoints'], 'icon-budicon-638')}
          {boxContainer(category.sections['explorer'], 'icon-budicon-631')}
          <div className="col-xs-12 col-md-4">
            <div className="subcontent-box">
              <div className="row">
                <div className="col-xs-12">
                  <h3>Announcements</h3>
                  <ul>
                    {category.sections['announcements'].links.slice(0, 3).map((announcement, i) => (
                      <li key={i}>
                        <a href={announcement.href}>{announcement.name}</a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiSection;
