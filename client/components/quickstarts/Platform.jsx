import React, { PropTypes } from 'react';
import { get } from 'lodash';
import navigateToQuickstart from '../../action/navigateToQuickstart';

class Platform extends React.Component {

  constructor() {
    super();
    this.handleClick = this.handleClick.bind(this);
  }

  getStyle(hide) {
    return {
      animationDelay: `${this.props.delay}ms`,
      WebkitAnimationDelay: `${this.props.delay}ms`,
      animationDuration: '200ms',
      WebkitAnimationDuration: '200ms',
      animationTimingFunction: 'cubic-bezier(0.455, 0.03, 0.515, 0.955)',
      WebkitAnimationTimingFunction: 'cubic-bezier(0.455, 0.03, 0.515, 0.955)',
      visibility: hide ? 'hidden' : 'visible'
    };
  }

  handleClick() {
    const { quickstart, platform } = this.props;
    const payload = {
      quickstartId: quickstart.name,
      platformId: platform.name
    };
    this.context.executeAction(navigateToQuickstart, payload);
  }

  render() {
    const { platform, hide } = this.props;
    return (
      <li className="animated scaleIn" style={this.getStyle(hide)}>
        <div
          data-name={platform.logo_name || platform.name}
          className="circle-logo"
          onClick={this.handleClick}
        >
          <div className="logo">
            { get(this.props, 'platform.community') &&
              <div className="community-maintained-badge">
                <div className="icon" />
              </div>
            }
          </div>
          <div className="title">{platform.title}</div>
        </div>
      </li>
    );
  }

}

Platform.propTypes = {
  quickstart: PropTypes.object,
  platform: PropTypes.object,
  delay: PropTypes.number,
  hide: PropTypes.bool
};

Platform.contextTypes = {
  executeAction: PropTypes.func,
  trackEvent: React.PropTypes.func.isRequired
};

export default Platform;
