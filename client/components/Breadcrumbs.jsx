import React from 'react';
import { getPlatformName, getTechTitle } from '../util/tutorials';
var NavLink = require('fluxible-router').NavLink;

class Breadcrumbs extends React.Component {
  render() {
    var list = [];
    var p = this.props;
    if(p.appType) {
      list.push(
        <NavLink key="base" href={`${p.baseUrl || '/'}`}>
          <span className="text">Documentation</span>
        </NavLink>
      );
      list.push(
        <NavLink key="apptype" href={`${p.baseUrl}/quickstart/${p.appType}`}>
          <i className="icon-budicon-461"></i><span className="text">{getPlatformName(p.appType)}</span>
        </NavLink>
      );
    } else {
      return (<div></div>);
    }

    if(p.tech1) {
      list.push(
        <NavLink key="tech1" href={`${p.baseUrl}/quickstart/${p.appType}/${p.tech1}`}>
          <i className="icon-budicon-461"></i><span className="text">{getTechTitle(p.quickstart, p.appType, p.tech1)}</span>
        </NavLink>
      );
    }

    if(p.tech2) {
      list.push(
        <NavLink key="tech2" href={`${p.baseUrl}/quickstart/${p.appType}/${p.tech1}/${p.tech2}`}>
          <i className="icon-budicon-461"></i><span className="text">{getTechTitle(p.quickstart, 'backend', p.tech2)}</span>
        </NavLink>
      );
    }

    return (<div className="breadcrumbs">{list}</div>);
  }
}

export default Breadcrumbs;
