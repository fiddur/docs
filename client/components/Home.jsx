import React from 'react';
import TutorialNavigator from './TutorialNavigator';
import NavigationStore from '../stores/NavigationStore';
import SearchBox from './SearchBox';
import ShowcaseItem from './ShowcaseItem';
import CircleLogo from './CircleLogo';
import HowTo from './HowTo';
import { connectToStores } from 'fluxible-addons-react';

class InlineNav extends React.Component {
  componentDidMount () {
    this.initClient();
  }
  componentDidUpdate() {
    this.initClient();
  }
  initClient(html) {
    if (typeof document !== 'undefined') {
      Auth0Docs.stickyNav();
    }
  }
  render() {
    return (
      <ul className="list-inline">
        {this.props.categories.map((category) => (
          <li key={category.id}>
            <a href={'#' + category.id}>{category.name}</a>
          </li>
        ))}
      </ul>
    );
  }
}


var ProductSection = ({category, baseUrl}) => (
  <div className="showcase">
    <div className="container">
      <div className="row">
        {category.links.map((link, i) => (
          <ShowcaseItem key={i} {...link} baseUrl={baseUrl} />
        ))}
      </div>
    </div>
  </div>
);

var ApiSection = ({category, baseUrl}) => {

  var boxContainer = (item, icon) => (
    <div className="col-xs-6 col-md-4">
      <a className="icon-scale api-link" href={baseUrl + item.href}>
        <i className={icon} />
        <strong>{item.name}</strong>
        <p>{item.description}</p>
      </a>
    </div>
  );

  var announcementLink = (announcement) => {
    if (announcement.href.indexOf('http')) {
      return (<a href={announcement.href}>{announcement.name}</a>);
    } else {
      return (<a href={baseUrl + announcement.href}>{announcement.name}</a>);
    }
  }

  return (
    <div className="api-docs">
      <div className="container">
        <div className="row">
          {boxContainer(category.sections['explorer'], 'icon-budicon-631')}
          {boxContainer(category.sections['auth-endpoints'], 'icon-budicon-638')}
          <div className="col-xs-12 col-md-4">
            <div className="subcontent-box">
              <div className="row">
                <div className="col-xs-12">
                  <h3>Announcements</h3>
                  <ul>
                    {category.sections['announcements'].links.map((announcement, i) => (
                      <li key={i}>
                        {announcementLink(announcement)}
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

var SdkSection = ({category, baseUrl}) => (
  <div className="container">
    <ul className="circle-list">
      {category.links.map((link, i) => (
        <li key={i}>
          <CircleLogo {...link} baseUrl={baseUrl} />
        </li>
      ))}
    </ul>
  </div>
);

var HowToSection = ({category, baseUrl}) => (
  <div className="container">
    <ul className="list-howtos">
      {category.links.map((link, i) => (
        <li key={i}>
          <HowTo {...link} baseUrl={baseUrl} />
        </li>
      ))}
    </ul>
  </div>
);

var CategorySection = ({category, baseUrl}) => {
  var sectionContainer;
  var className;
  switch (category.id) {
    case 'product':
      className = 'section-p'
      sectionContainer = (category) => (<ProductSection category={category} baseUrl={baseUrl} />);
      break;
    case 'api':
      sectionContainer = (category) => (<ApiSection category={category} baseUrl={baseUrl} />);
      break;
    case 'sdk':
      sectionContainer = (category) => (<SdkSection category={category} baseUrl={baseUrl} />);
      break;
    case 'how-to':
      sectionContainer = (category) => (<HowToSection category={category} baseUrl={baseUrl} />);
      break;
  }

  if (!sectionContainer) {
    throw 'Invalid category id';
  }


  return (
    <section className="section-product" id={category.id}>
      <div className="container">
        <h2>
          <span>{category.name}</span>
          <span>{category.description}</span>
        </h2>
      </div>
      {sectionContainer(category)}
    </section>
  );
};

class Home extends React.Component {
  render() {
    return (
      <div>
        <TutorialNavigator {...this.props} />
        <div className="navigation-bar js-sticky-nav">
          <div className="wrapper">
            <div className="container">
              <InlineNav categories={this.props.categories} />
              <SearchBox baseUrl={this.props.baseUrl} />
            </div>
          </div>
        </div>
        {this.props.categories.map((category) => (
          <CategorySection key={category.id} category={category} baseUrl={this.props.baseUrl} />
        ))}
      </div>
    );
  }
}

Home.contextTypes = {
  getStore: React.PropTypes.func
};

Home = connectToStores(Home, [NavigationStore], (context, props) => ({
  categories: context.getStore(NavigationStore).getCategories()
}));

export default Home;
