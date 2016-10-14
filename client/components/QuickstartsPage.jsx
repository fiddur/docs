import React from 'react';
import { connectToStores } from 'fluxible-addons-react';
import { TutorialNavigator, TutorialStore } from 'auth0-tutorial-navigator';
import { quickstartNavigationAction } from '../action/quickstartNavigationAction';
import NavigationBar from './NavigationBar';
import Spinner from './Spinner';

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
      0: { items: 1, stagePadding: 60, center: true },
      380: { items: 2, stagePadding: 0, center: true },
      570: { items: 3, stagePadding: 0, center: true },
      768: { items: 4, stagePadding: 0, center: false, mouseDrag: false, touchDrag: false },
      880: { items: 4, stagePadding: 0, autoWidth: true, center: false, mouseDrag: false, touchDrag: false }
    }
  });
};

class QuickstartsPage extends React.Component {

  render() {
    if (!this.props.quickstarts) {
      return (<Spinner />);
    }

    return (
      <div className="document docs-quickstart-selector">
        <NavigationBar currentSection="quickstarts" />
        <TutorialNavigator
          {...this.props}
          customNavigationAction={quickstartNavigationAction}
          componentLoadedInBrowser={initCarouselInBrowser}
        />
      </div>
    );
  }

}

QuickstartsPage.contextTypes = {
  getStore: React.PropTypes.func
};

QuickstartsPage.propTypes = {
  quickstarts: React.PropTypes.object
};


QuickstartsPage = connectToStores(QuickstartsPage, [TutorialStore], (context, props) => {
  const store = context.getStore(TutorialStore);
  return {
    quickstarts: store.getQuickstarts()
  };
});

export default QuickstartsPage;
