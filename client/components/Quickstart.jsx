import React from 'react';
import {navigateAction} from 'fluxible-router';

class Quickstart extends React.Component {
  handleClick(quickstart) {
    // var question = this.props.getQuestion(quickstart.name);
    //
    var url = '/docs/quickstart/' + quickstart.name;
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
  executeAction: React.PropTypes.func,
};

export default Quickstart;
