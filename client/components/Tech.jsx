import React from 'react';
import { navigateAction } from 'fluxible-router';

class Tech extends React.Component {
  handleClick(tech) {
    var url = `${this.props.baseUrl}/quickstart/${this.props.appType}/`;
    if(this.props.tech1) {
      url += `${this.props.tech1}/${tech.name}`;
    } else {
      url += tech.name;
    }

    this.context.executeAction(navigateAction, {
      url: url
    });
  }
  render() {
    var tech = this.props.tech;
    var style = {
      animationDelay: this.props.delay + 'ms',
      WebkitAnimationDelay: this.props.delay + 'ms',
      animationDuration: '200ms',
      WebkitAnimationDuration: '200ms',
      animationTimingFunction: 'cubic-bezier(0.455, 0.03, 0.515, 0.955)',
      WebkitAnimationTimingFunction: 'cubic-bezier(0.455, 0.03, 0.515, 0.955)'
    };

    return (
      <li className='animated scaleIn' style={style}>
        <div data-name={tech.name} className='circle-logo' onClick={this.handleClick.bind(this, tech)}>
          <div className='logo'></div>
          <div className='title'>{tech.title}</div>
        </div>
      </li>
    );
  }
}

Tech.contextTypes = {
  executeAction: React.PropTypes.func,
};

export default Tech;
