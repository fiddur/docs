import React from 'react';
import { TutorialNavigator } from 'auth0-tutorial-navigator';
import NavigationStore from '../stores/NavigationStore';
import SearchBox from './SearchBox';
import { connectToStores } from 'fluxible-addons-react';
import initStickyNav from '../browser/stickyNav';
import { quickstartNavigationAction } from '../action/quickstartNavigationAction';
import { CategorySection } from './NavigationSections';

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
