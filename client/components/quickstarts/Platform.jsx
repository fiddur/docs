import React from 'react';
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
            { platform.community &&
              <div className="community-maintained-badge">
                <div className="icon-container">
                  <svg fill="#222228" height="20" viewBox="0 0 24 24" width="20" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                    <path d="M0 0h24v24H0z" fill="none" />
                  </svg>
                </div>
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
