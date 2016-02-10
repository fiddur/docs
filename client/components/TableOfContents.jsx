import _ from 'lodash';
import React from 'react';

var TableOfContents = ({categories}) => {
  return (
    <section className="wrapper table-of-contents section-product" id="toc">
      <div className="container">
        <div className="row">
          <div className="col-md-4">
            <h3>Getting Started</h3>
            <ul className="list-unstyled">
              {_.find(categories, { id: 'start'}).links.map((link, i) => (
                <li key={i}>
                  <a href={link.href}>{link.name}</a>
                </li>
              ))}
            </ul>
            <h3>Platforms</h3>
            <ul className="list-unstyled">
              {_.find(categories, { id: 'platform'}).links.map((link, i) => (
                <li key={i}>
                  <a href={link.href}>{link.name}</a>
                </li>
              ))}
            </ul>
          </div>
          <div className="col-md-4">
            <h3>SDKs</h3>
            <ul className="list-unstyled">
              {_.find(categories, { id: 'sdk'}).links.map((link, i) => (
                <li key={i}>
                  <a href={link.href}>{link.name}</a>
                </li>
              ))}
              <li>
                <a href="/libraries/sdks/more">Other SDKs</a>
              </li>
            </ul>
            <h3>Web Frameworks</h3>
            <ul className="list-unstyled">
              {_.find(categories, { id: 'web-frameworks'}).links.map((link, i) => (
                <li key={i}>
                  <a href={link.href}>{link.name}</a>
                </li>
              ))}
              <li>
                <a href="/libraries/sdks/more">Other Frameworks</a>
              </li>
            </ul>
          </div>
          <div className="col-md-4">
            <h3>UI Components</h3>
            <ul className="list-unstyled">
              {_.find(categories, { id: 'ui-component'}).links.map((link, i) => (
                <li key={i}>
                  <a href={link.href}>{link.name}</a>
                  <span>{link.description}</span>
                </li>
              ))}
            </ul>
            <h3>Guides</h3>
            <ul className="list-unstyled">
              {_.find(categories, { id: 'how-to'}).links.map((link, i) => (
                <li key={i}>
                  <a href={link.href}>{link.name}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}



export default TableOfContents;
