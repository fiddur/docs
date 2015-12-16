import React from 'react';
import ShowcaseItem from './ShowcaseItem';
import CircleLogo from './CircleLogo';
import HowTo from './HowTo';
import {NavLink} from 'fluxible-router';

export var ProductSection = ({category, top}) => (
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

export var ApiSection = ({category}) => {

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

export var SdkSection = ({category, top}) => (
  <div className="container">
    <ul className="circle-list">
      {(top ? category.links.slice(0, top) : category.links).map((link, i) => (
        <li key={i}>
          <CircleLogo {...link} />
        </li>
      ))}
    </ul>
  </div>
);

export var HowToSection = ({category, top}) => (
  <div className="container">
    <ul className="list-howtos">
      {(top ? category.links.slice(0, top) : category.links).map((link, i) => (
        <li key={i}>
          <HowTo {...link} />
        </li>
      ))}
    </ul>
  </div>
);

export var CategorySection = ({category, linkTo}) => {

  var getSectionTitle = (name, routeName) => {
    if (routeName && linkTo !== false) {
      return (<span><NavLink routeName={routeName}>{name}</NavLink></span>);
    } else {
      return (<span>{name}</span>);
    }
  }

  var sectionContainer;
  var sectionTitle;
  var className;
  switch (category.id) {
  case 'product':
    className = 'section-p';
    sectionTitle = getSectionTitle(category.name);
    sectionContainer = (category) => (<ProductSection category={category} top={9} />);
    break;
  case 'api':
    sectionTitle = getSectionTitle(category.name);
    sectionContainer = (category) => (<ApiSection category={category} />);
    break;
  case 'sdk':
    sectionTitle = getSectionTitle(category.name, 'sdks');
    sectionContainer = (category) => (<SdkSection category={category} top={18} />);
    break;
  case 'how-to':
    sectionTitle = getSectionTitle(category.name, 'howTos');
    sectionContainer = (category) => (<HowToSection category={category} top={12} />);
    break;
  }

  if (!sectionContainer) {
    throw 'Invalid category id';
  }

  return (
    <section className="section-product" id={category.id}>
      <div className="container">
        <h2>
          {sectionTitle}
          <span>{category.description}</span>
        </h2>
      </div>
      {sectionContainer(category)}
    </section>
  );
};
