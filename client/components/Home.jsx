import React from 'react';
import { TutorialNavigator } from 'auth0-tutorial-navigator';
import NavigationStore from '../stores/NavigationStore';
import SearchBox from './SearchBox';
import ShowcaseItem from './ShowcaseItem';
import CircleLogo from './CircleLogo';
import HowTo from './HowTo';
import { connectToStores } from 'fluxible-addons-react';
import initStickyNav from '../browser/stickyNav';
import { quickstartNavigationAction } from '../action/quickstartNavigationAction';

class InlineNav extends React.Component {
  componentDidMount () {
    this.initClient();
  }
  componentDidUpdate() {
    this.initClient();
  }
  initClient(html) {
    if (typeof document !== 'undefined') {
      initStickyNav();
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


var ProductSection = ({category}) => (
  <div className="showcase">
    <div className="container">
      <div className="row">
        {category.links.map((link, i) => (
          <ShowcaseItem key={i} {...link} />
        ))}
      </div>
    </div>
  </div>
);

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
                    {category.sections['announcements'].links.map((announcement, i) => (
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

var SdkSection = ({category}) => (
  <div className="container">
    <ul className="circle-list">
      {category.links.map((link, i) => (
        <li key={i}>
          <CircleLogo {...link} />
        </li>
      ))}
    </ul>
  </div>
);

var HowToSection = ({category}) => (
  <div className="container">
    <ul className="list-howtos">
      {category.links.map((link, i) => (
        <li key={i}>
          <HowTo {...link} />
        </li>
      ))}
    </ul>
  </div>
);

var CategorySection = ({category}) => {
  var sectionContainer;
  var className;
  switch (category.id) {
    case 'product':
      className = 'section-p'
      sectionContainer = (category) => (<ProductSection category={category} />);
      break;
    case 'api':
      sectionContainer = (category) => (<ApiSection category={category} />);
      break;
    case 'sdk':
      sectionContainer = (category) => (<SdkSection category={category} />);
      break;
    case 'how-to':
      sectionContainer = (category) => (<HowToSection category={category} />);
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
    var componentLoadedInBrowser = function(){
      var $carousel = $(this.refs.carousel);
      $carousel.owlCarousel({
        margin: 20,
        center: true,
        dots: true,
        navContainerClass: 'nav',
        navClass: ['prev', 'next'],
        baseClass: 'js-carousel',
        itemClass: 'item',
        dotsClass: 'dots',
        dotClass: 'dot',
        nav: false,
        responsive: {
          0: {
            items: 1,
            stagePadding: 60
          },
          380: {
            items: 2,
            stagePadding: 0
          },
          570: {
            items: 3,
            stagePadding: 0
          },
          768: {
            items: 4,
            stagePadding: 0
          },
          992: {
            items: 5,
            stagePadding: 0,
            center: false,
            dots: false
          }
        }
      });
    };

    return (
      <div>
        <TutorialNavigator {...this.props} customNavigationAction={quickstartNavigationAction} componentLoadedInBrowser={componentLoadedInBrowser}/>
        <div className="navigation-bar js-sticky-nav">
          <div className="wrapper">
            <div className="container">
              <InlineNav categories={this.props.categories} />
              <SearchBox />
            </div>
          </div>
        </div>
        {this.props.categories.map((category) => (
          <CategorySection key={category.id} category={category} />
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
