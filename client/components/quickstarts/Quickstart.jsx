import React from 'react';
import navigateToQuickstart from '../../action/navigateToQuickstart';

class Quickstart extends React.Component {

  constructor() {
    super();
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(quickstart) {
    this.context.executeAction(navigateToQuickstart, {
      quickstartId: this.props.quickstart.name
    });
  }

  render() {
    const { quickstart } = this.props;
    return (
      <div className="quickstart" data-type={quickstart.name} onClick={this.handleClick}>
        <div className="symbol" />
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
};

Quickstart.contextTypes = {
  executeAction: React.PropTypes.func
};

export default Quickstart;
