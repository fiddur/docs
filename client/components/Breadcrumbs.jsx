import React from 'react';
import TutorialStore from '../stores/TutorialStore';
import { connectToStores, provideContext } from 'fluxible-addons-react';
import { getPlatformName, getTechTitle } from '../util/tutorials';
var NavLink = require('fluxible-router').NavLink;

class Breadcrumbs extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = this.getStoreState();
  }
  getStoreState () {
    return this.context.getStore(TutorialStore).getState();
  }
  componentDidMount () {
      this.context.getStore(TutorialStore).addChangeListener(this._onStoreChange.bind(this));
  }
  componentWillUnmount () {
      this.context.getStore(TutorialStore).removeChangeListener(this._onStoreChange.bind(this));
  }
  _onStoreChange () {
      this.setState(this.getStoreState());
  }
  render() {
    var list = [];
    var s = this.state;
    if(s.appType) {
      list.push(
        <NavLink href={`${s.baseUrl || '/'}`}>
          <span className="text">Documentation</span>
        </NavLink>
      );
      list.push(
        <NavLink href={`${s.baseUrl}/quickstart/${s.appType}`}>
          <i className="icon-budicon-461"></i><span className="text">{getPlatformName(s.appType)}</span>
        </NavLink>
      );
    } else {
      return (<div></div>);
    }

    if(this.state.tech1) {
      list.push(
        <NavLink href={`${s.baseUrl}/quickstart/${s.appType}/${s.tech1}`}>
          <i className="icon-budicon-461"></i><span className="text">{getTechTitle(s.quickstart, s.appType, s.tech1)}</span>
        </NavLink>
      );
    }

    if(this.state.tech2) {
      list.push(
        <NavLink href={`${s.baseUrl}/quickstart/${s.appType}/${s.tech1}/${s.tech2}`}>
          <i className="icon-budicon-461"></i><span className="text">{getTechTitle(s.quickstart, 'backend', s.tech2)}</span>
        </NavLink>
      );
    }

    return (<div className="breadcrumbs">{list}</div>);
  }
}

Breadcrumbs.contextTypes = {
  getStore: React.PropTypes.func,
  executeAction: React.PropTypes.func
};

export default Breadcrumbs;
