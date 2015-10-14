import React from 'react';
import TutorialStore from '../stores/TutorialStore';
import {navigateAction} from 'fluxible-router';

class Tech extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = this.getStoreState();
  }
  getStoreState () {
    return this.context.getStore(TutorialStore).getState();
  }
  componentDidMount () {
    this.context
      .getStore(TutorialStore)
      .addChangeListener(this._onStoreChange.bind(this));
  }
  componentWillUnmount () {
    this.context
      .getStore(TutorialStore)
      .removeChangeListener(this._onStoreChange.bind(this));
  }
  _onStoreChange () {
    this.setState(this.getStoreState());
  }
  handleClick(tech) {
    var url = `${this.state.baseUrl}/quickstart/${this.state.appType}/`;
    if(this.state.tech1) {
      url += `${this.state.tech1}/${tech.name}`;
    } else {
      url += tech.name;
    }

    this.context.executeAction(navigateAction, {
      url: url
    });
  }
  render() {
    var tech = this.props.model;
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
  getStore: React.PropTypes.func,
  executeAction: React.PropTypes.func,
};

export default Tech;
