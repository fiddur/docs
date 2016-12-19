import React, { PropTypes } from 'react';
import { Sticky } from 'react-sticky';

// Higher-order component for react sticky for changing sticky properties
// depending on width viewport
class ResponsiveSticky extends React.Component {

  constructor() {
    super();

    // Server side rendering fix
    if (typeof window === 'undefined') {
      this.state = {};
      return;
    }

    this.state = {
      responsiveMode: window.matchMedia('(max-width: 992px)').matches
    };
  }

  componentDidMount() {
    window.addEventListener('resize', () => {
      this.setState({
        responsiveMode: window.matchMedia('(max-width: 992px)').matches
      });
    });
  }

  render() {
    const { children, mobileOffset, desktopOffset, ...props } = this.props;
    return (
      <Sticky topOffset={this.state.responsiveMode ? mobileOffset : desktopOffset} {...props}>
        {this.props.children}
      </Sticky>
    );
  }

}

ResponsiveSticky.propTypes = {
  children: PropTypes.node.isRequired,
  mobileOffset: PropTypes.number.isRequired,
  desktopOffset: PropTypes.number.isRequired
};

export default ResponsiveSticky;
