import React from 'react';
import navigateAction from '../../action/navigateTutorial';
import loadArticleAction from '../../action/loadTutorialNavArticle';

class Platform extends React.Component {

  handleClick() {
    let {quickstart, platform } = this.props;
    let payload = {
      quickstartId: quickstart.name,
      platformId: platform.name
    };
    this.context.executeAction(navigateAction, payload)
  }

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

  render() {
    var {platform} = this.props;
    return (
      <li className='animated scaleIn' style={this.getStyle()}>
        <div data-name={platform.logo_name || platform.name} className='circle-logo' onClick={this.handleClick.bind(this)}>
          <div className='logo'></div>
          <div className='title'>{platform.title}</div>
        </div>
      </li>
    );
  }

}

Platform.propTypes = {
  quickstart: React.PropTypes.object,
  platform: React.PropTypes.object
}

Platform.contextTypes = {
  executeAction: React.PropTypes.func,
};

export default Platform;
