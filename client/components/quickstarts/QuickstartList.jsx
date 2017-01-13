import React from 'react';
import Quickstart from './Quickstart';

class QuickstartList extends React.Component {

  loadCarousel(element) {
    if (typeof window !== 'undefined') {
      const $carousel = $(element);
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
  }

  render() {
    const { quickstarts, isFramedMode } = this.props;

    let carousel = null;
    let items = null;
    let hide = 'hide ';

    if (quickstarts) {
      hide = '';
      items = Object.keys(quickstarts).map(name => (
        <Quickstart
          key={name}
          quickstart={quickstarts[name]}
          isFramedMode={isFramedMode}
        />
      ));
    }

    if (isFramedMode) {
      carousel = <div className="js-carousel">{items}</div>;
    } else {
      carousel = <div className="js-carousel" ref={this.loadCarousel}>{items}</div>;
    }

    return (
      <div className={`${hide} quickstart-list container`}>
        {carousel}
      </div>
    );
  }

}

QuickstartList.propTypes = {
  quickstarts: React.PropTypes.object,
  isFramedMode: React.PropTypes.bool.isRequired
};

export default QuickstartList;
