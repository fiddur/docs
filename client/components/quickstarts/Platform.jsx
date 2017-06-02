import React, { PropTypes } from 'react';
import { get } from 'lodash';
import navigateToQuickstart from '../../action/navigateToQuickstart';

class Platform extends React.Component {

  constructor() {
    super();
    this.handleClick = this.handleClick.bind(this);
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
    const { platform, otherType } = this.props;
    return (
      <li>
        <div
          data-name={platform.logo_name || platform.name}
          className={`circle-logo ${otherType ? 'other-platforms-item' : ''}`}
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

Platform.defaultProps = {
  otherType: false
};

Platform.propTypes = {
  quickstart: PropTypes.object,
  platform: PropTypes.object,
  otherType: PropTypes.bool
};

Platform.contextTypes = {
  executeAction: PropTypes.func,
  trackEvent: React.PropTypes.func.isRequired
};

export default Platform;