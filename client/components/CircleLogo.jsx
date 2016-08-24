import React from 'react';
import { NavLink } from 'fluxible-router';
import { quickstartNavigationAction } from '../action/quickstartNavigationAction';

class CircleLogo extends React.Component {

  getStyle() {
    return {
      animationDelay: this.props.delay + 'ms',
      WebkitAnimationDelay: this.props.delay + 'ms',
      animationDuration: '200ms',
      WebkitAnimationDuration: '200ms',
      animationTimingFunction: 'cubic-bezier(0.455, 0.03, 0.515, 0.955)',
      WebkitAnimationTimingFunction: 'cubic-bezier(0.455, 0.03, 0.515, 0.955)'
    };
  }

  handleClick() {
    // TODO: Right now these redirect to the platform quickstarts, but we may want a different
    // behavior in the future. If so, change this to the regular fluxible navigateAction.
    let {platform} = this.props;
    this.context.executeAction(quickstartNavigationAction, {
      quickstartId: platform.platform_type,
      platformId:   platform.hash
    });
  }

  render() {

    let {platform} = this.props;

    return (
      <li className="animated scaleIn sdk-platform" style={this.getStyle()}>
        <div data-name={platform.hash} className="circle-logo" onClick={this.handleClick.bind(this)}>
          <div className="logo"></div>
          <div className="title">{platform.name}</div>
        </div>
      </li>
    );

  }

}

CircleLogo.contextTypes = {
  executeAction: React.PropTypes.func,
};

export default CircleLogo;
