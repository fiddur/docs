import React from 'react';
import { get } from 'lodash';
import navigateToQuickstart from '../../action/navigateToQuickstart';

class Platform extends React.Component {

  constructor() {
    super();
    this.handleClick = this.handleClick.bind(this);
  }

  getStyle() {
    return {
      animationDelay: `${this.props.delay}ms`,
      WebkitAnimationDelay: `${this.props.delay}ms`,
      animationDuration: '200ms',
      WebkitAnimationDuration: '200ms',
      animationTimingFunction: 'cubic-bezier(0.455, 0.03, 0.515, 0.955)',
      WebkitAnimationTimingFunction: 'cubic-bezier(0.455, 0.03, 0.515, 0.955)'
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
    const { platform } = this.props;
    return (
      <li className="animated scaleIn" style={this.getStyle()}>
        <div
          data-name={platform.logo_name || platform.name}
          className="circle-logo"
          onClick={this.handleClick}
        >
          <div className="logo">
            { get(this.props, 'platform.community') &&
              <div className="community-maintained-badge">
                <svg fill="#eee" height="22" viewBox="0 0 24 24" width="22" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
                  <path d="M0 0h24v24H0z" fill="none" />
                </svg>
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
  quickstart: React.PropTypes.object,
  platform: React.PropTypes.object,
  delay: React.PropTypes.number
};

Platform.contextTypes = {
  executeAction: React.PropTypes.func
};

export default Platform;
