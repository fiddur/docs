import React from 'react';
import {NavLink} from 'fluxible-router';

class Breadcrumbs extends React.Component {
  render() {
    var list = [];
    list.push(
      <NavLink key="base" routeName="home">
        <span className="text">Documentation</span>
      </NavLink>
    );

    this.props.links.forEach((link, i) => {
      if (link.href) {
        list.push(
          <NavLink key={i} href={link.href}>
            <i className="icon-budicon-461"></i><span className="text">{link.name}</span>
          </NavLink>
        );
      } else {
        list.push(
          <span key={i}>
            <i className="icon-budicon-461"></i><span className="text">{link.name}</span>
          </span>
        );
      }
    });

    return (<div className="breadcrumbs">{list}</div>);
  }
}

export default Breadcrumbs;
