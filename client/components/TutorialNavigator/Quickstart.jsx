import React from 'react';
import navigateAction from '../../action/navigateTutorial';

class Quickstart extends React.Component {

  handleClick(quickstart) {
    this.context.executeAction(navigateAction, {quickstartId: quickstart.name});
  }

  render() {
    var {quickstart} = this.props;
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

Quickstart.propTypes = {
  quickstart: React.PropTypes.object
}

Quickstart.contextTypes = {
  executeAction: React.PropTypes.func,
};

export default Quickstart;
