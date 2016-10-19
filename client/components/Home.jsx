import React from 'react';
import { connectToStores } from 'fluxible-addons-react';
import TutorialNavigator from './TutorialNavigator/TutorialNavigator';
import TutorialStore from '../stores/TutorialStore';
import { quickstartNavigationAction } from '../action/quickstartNavigationAction';
import NavigationStore from '../stores/NavigationStore';
import CategoryCard from './CategoryCard';
import TryBanner from './TryBanner';
import SearchBox from './SearchBox';
import Spinner from './Spinner';

// TODO: This depends on a "carousel" ref that's set by the TutorialNavigator itself.
// Can we move this into the component's codebase somehow?
function initCarouselInBrowser() {
  const $carousel = $(this.refs.carousel);
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
      0: { items: 1, stagePadding: 60, center: true },
      380: { items: 2, stagePadding: 0, center: true },
      570: { items: 3, stagePadding: 0, center: true },
      768: { items: 4, stagePadding: 0, center: false, mouseDrag: false, touchDrag: false },
      880: { items: 4, stagePadding: 0, autoWidth: true, center: false, mouseDrag: false, touchDrag: false }
    }
  });
}

class Home extends React.Component {

  renderTutorialNav() {
    if (!this.props.quickstarts) {
      return <Spinner />;
    }

    return (
      <TutorialNavigator
        {...this.props}
        customNavigationAction={quickstartNavigationAction}
        componentLoadedInBrowser={initCarouselInBrowser}
      />
    );
  }

  render() {
    const { cards, isAuthenticated } = this.props;
    const tryBanner = isAuthenticated ? null : <TryBanner />;

    let cardElements;
    if (cards) {
      cardElements = cards.map(category => (
        <CategoryCard key={category.id} category={category} />
      ));
    }

    return (
      <div className="docs-home">
        <div className="docs-header">
          <div className="container">
            <h1>Documentation</h1>
          </div>
        </div>
        {this.renderTutorialNav()}
        {tryBanner}
        <div className="category-cards container center-block">
          <h1>Curated content to fully understand our platform</h1>
          <SearchBox />
          {cardElements}
        </div>
      </div>
    );
  }

}

Home.propTypes = {
  isAuthenticated: React.PropTypes.bool,
  quickstarts: React.PropTypes.object,
  cards: React.PropTypes.array
};

Home.contextTypes = {
  getStore: React.PropTypes.func
};

Home = connectToStores(Home, [NavigationStore, TutorialStore], (context, props) => ({
  quickstarts: context.getStore(TutorialStore).getQuickstarts(),
  cards: context.getStore(NavigationStore).getCards()
}));

export default Home;
