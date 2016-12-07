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
      platformId: platform.name,
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
          <div className="logo" />
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
