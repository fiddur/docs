import React from 'react';
import TutorialStore from '../stores/TutorialStore';
import { connectToStores, provideContext } from 'fluxible-addons-react';
import { getPlatformName, getTechTitle } from '../util/tutorials';

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
    if(this.state.appType) {
      list.push(<a href={this.state.baseUrl + "/"}><span className="text">Documentation</span></a>);
      list.push(<a href={this.state.baseUrl + "/quickstart/"}><i className="icon-budicon-461"></i><span className="text">{getPlatformName(this.state.appType)}</span></a>);
    } else {
      return (<div></div>);
    }

    if(this.state.tech1) {
      list.push(<a href={this.state.baseUrl + "/quickstart/" + this.state.appType + "/"}><i className="icon-budicon-461"></i><span className="text">{getTechTitle(this.state.quickstart, this.state.appType, this.state.tech1)}</span></a>);
    }

    if(this.state.tech2) {
      list.push(<a href={this.state.baseUrl + "/quickstart/" + this.state.appType + "/" + this.state.tech1}><i className="icon-budicon-461"></i><span className="text">{getTechTitle(this.state.quickstart, 'backend', this.state.tech2)}</span></a>);
    }

    return (<div className="breadcrumbs">{list}</div>);
  }
}

Breadcrumbs.contextTypes = {
  getStore: React.PropTypes.func,
  executeAction: React.PropTypes.func
};

export default Breadcrumbs;
