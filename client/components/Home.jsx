import React from 'react';
import { TutorialNavigator } from 'auth0-tutorial-navigator';
import NavigationStore from '../stores/NavigationStore';
import { connectToStores } from 'fluxible-addons-react';
import { quickstartNavigationAction } from '../action/quickstartNavigationAction';
import HomeSectionContainer from './HomeSectionContainer';
import TableOfContents from './TableOfContents';
import ProductSection from './ProductSection';
import ApiSection from './ApiSection';
import InlineNav from './InlineNav';
import TryBanner from './TryBanner';

// TODO: This depends on a "carousel" ref that's set by the TutorialNavigator itself.
// Can we move this into the component's codebase somehow?
var initCarouselInBrowser = function() {
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
      0:   {items: 1, stagePadding: 60},
      380: {items: 2, stagePadding: 0},
      570: {items: 3, stagePadding: 0},
      768: {items: 4, stagePadding: 0},
      992: {items: 5, stagePadding: 0, center: false, dots: false}
    }
  });
};

class Home extends React.Component {
  
  render() {
    
    var homeNavCategories = [];
    var productCategory;
    var apiCategory;
    var tocCategory = {
      id: 'toc',
      name: 'Guides & SDKs',
      description: 'References and documentation'
    };
    var tocCategories = [];
    homeNavCategories[2] = tocCategory;
    this.props.categories.map(category => {
      switch (category.id) {
      case 'product':
        productCategory = category;
        homeNavCategories[0] = category;
        break;
      case 'api':
        apiCategory = category;
        homeNavCategories[1] = category;
        break;
      default:
        tocCategories.push(category);
        break;
      }
    });
    
    let {isAuthenticated} = this.props;
    let tryBanner = isAuthenticated ? null : <TryBanner/>;

    return (
      <div>
        <TutorialNavigator {...this.props} customNavigationAction={quickstartNavigationAction} componentLoadedInBrowser={initCarouselInBrowser} />
        {tryBanner}
        <InlineNav categories={homeNavCategories} />
        <HomeSectionContainer {...productCategory}>
          <ProductSection category={productCategory} />
        </HomeSectionContainer>
        <HomeSectionContainer {...apiCategory}>
          <ApiSection category={apiCategory} />
        </HomeSectionContainer>
        <HomeSectionContainer {...tocCategory}>
          <TableOfContents categories={tocCategories} />
        </HomeSectionContainer>
      </div>
    );
  }
  
}

Home.propTypes = {
  isAuthenticated: React.PropTypes.bool
}

Home.contextTypes = {
  getStore: React.PropTypes.func
};

Home = connectToStores(Home, [NavigationStore], (context, props) => ({
  categories: context.getStore(NavigationStore).getCategories()
}));

export default Home;
