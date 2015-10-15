import React from 'react';
import TutorialStore from '../stores/TutorialStore';
import Quickstart from './Quickstart';

class QuickstartList extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = this.getStoreState();
  }
  getStoreState() {
    return this.context.getStore(TutorialStore).getState();
  }
  componentDidMount() {
    this.context
      .getStore(TutorialStore)
      .addChangeListener(this._onStoreChange.bind(this));

    if (typeof window !== 'undefined') {
      this.componentDidMountClient();
    }
  }
  componentDidMountClient() {
    // Runs only on client, not on server
    var $carousel = $(this.refs.carousel.getDOMNode());

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
  componentWillUnmount() {
    this.context
      .getStore(TutorialStore)
      .removeChangeListener(this._onStoreChange.bind(this));
  }
  _onStoreChange() {
    this.setState(this.getStoreState());
  }
  render() {
    var list = [];
    var hide = (!this.state.quickstart.apptypes) ? 'hide ' : '';

    this.state.quickstart.apptypes.forEach(function(appType, i) {
        list.push(<Quickstart key={i} model={appType} />);
    }.bind(this));

    return (
      <div className={hide + "quickstart-list container"}>
        <div className="js-carousel" ref="carousel">{list}</div>
      </div>
    );
  }
}

QuickstartList.contextTypes = {
  getStore: React.PropTypes.func,
  executeAction: React.PropTypes.func,
};

export default QuickstartList;
