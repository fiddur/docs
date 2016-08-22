import React from 'react';
import {TutorialNavigator} from 'auth0-tutorial-navigator';
import {quickstartNavigationAction} from '../action/quickstartNavigationAction';
import NavigationBar from './NavigationBar';

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

class QuickstartsPage extends React.Component {
  
  render() {
    return (
      <div className="document">
        <NavigationBar />
        <TutorialNavigator {...this.props} customNavigationAction={quickstartNavigationAction} componentLoadedInBrowser={initCarouselInBrowser} />
      </div>
    );
  }
  
}

export default QuickstartsPage;
