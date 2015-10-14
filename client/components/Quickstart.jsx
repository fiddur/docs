import React from 'react';
import {navigateAction} from 'fluxible-router';
import TutorialStore from '../stores/TutorialStore';

class Quickstart extends React.Component {
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
  handleClick(quickstart) {
    // var question = this.props.getQuestion(quickstart.name);
    //
    var url = this.state.baseUrl + '/quickstart/' + quickstart.name;
    this.context.executeAction(navigateAction, {
      url: url
    });
  }
  render() {
    var quickstart = this.props.model;

    return (
      <div className="quickstart" data-type={quickstart.name} onClick={this.handleClick.bind(this, quickstart)}>
        <div className="symbol"></div>
        <strong className="title">{quickstart.title}</strong>
        <p className="description">{quickstart.description}</p>
        <p className="sample">{quickstart.example}</p>
        <div className="cta">
          <button className="btn btn-success btn-sm">Launch Quickstart</button>
        </div>
      </div>
    );
  }
}

Quickstart.contextTypes = {
  getStore: React.PropTypes.func,
  executeAction: React.PropTypes.func,
};

export default Quickstart;
