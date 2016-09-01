import React from 'react';
import {connectToStores} from 'fluxible-addons-react';
import {TutorialNavigator} from 'auth0-tutorial-navigator';
import {quickstartNavigationAction} from '../action/quickstartNavigationAction';
import NavigationStore from '../stores/NavigationStore';
import CategoryCard from './CategoryCard';
import TryBanner from './TryBanner';
import SearchBox from './SearchBox';
import DocsHeader from './DocsHeader';

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
      570: {items: 3, stagePadding: 0, autoWidth: true, center: false},
      768: {items: 4, stagePadding: 0, autoWidth: true, center: false},
    }
  });
};

class Home extends React.Component {
  
  render() {
    
    let {cardDefinitions, isAuthenticated} = this.props;
    let tryBanner = isAuthenticated ? null : <TryBanner/>;

    let cards = cardDefinitions.map(category => (
      <CategoryCard key={category.id} category={category} />
    ));

    return (
      <div className="docs-home">
        <DocsHeader />
        <TutorialNavigator {...this.props} customNavigationAction={quickstartNavigationAction} componentLoadedInBrowser={initCarouselInBrowser} />
        {tryBanner}
        <div className="category-cards container center-block">
          <h1>Curated content to fully understand our platform</h1>
          <SearchBox />
          {cards}
        </div>
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
  cardDefinitions: context.getStore(NavigationStore).getCards()
}));

export default Home;
