import React from 'react';
import Quickstart from './Quickstart';

class QuickstartList extends React.Component {
  componentDidMount() {
    if (typeof window !== 'undefined') {
      this.componentDidMountClient();
    }
  }
  componentDidMountClient() {
    // Runs only on client, not on server
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
  }
  render() {
    var list = [];
    var hide = (!this.props.quickstart.apptypes) ? 'hide ' : '';

    this.props.quickstart.apptypes.forEach(function(appType, i) {
        list.push(
          <Quickstart key={i} model={appType} baseUrl={this.props.baseUrl} />
        );
    }.bind(this));

    return (
      <div className={hide + "quickstart-list container"}>
        <div className="js-carousel" ref="carousel">{list}</div>
      </div>
    );
  }
}

export default QuickstartList;
