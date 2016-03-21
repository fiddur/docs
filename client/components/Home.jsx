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

    var tryBanner;
    if (!this.props.isAuthenticated) {
      tryBanner = (
        <div id="try-banner">
          <div className="try-banner try-banner-alt">
            <span>{'Don\'t have an account yet?'}</span>
            <a href="javascript:signup()" className="btn btn-success btn-lg">Try Auth0 for Free</a>
          </div>
        </div>
      );
    }

    return (
      <div>
        <TutorialNavigator {...this.props} customNavigationAction={quickstartNavigationAction} componentLoadedInBrowser={componentLoadedInBrowser} />
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

Home.contextTypes = {
  getStore: React.PropTypes.func
};

Home = connectToStores(Home, [NavigationStore], (context, props) => ({
  categories: context.getStore(NavigationStore).getCategories()
}));

export default Home;
