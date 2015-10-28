import React from 'react';
import ApplicationStore from '../stores/ApplicationStore';

class Html extends React.Component {
  render() {
    return (
      <div>
        <script dangerouslySetInnerHTML={{__html: this.props.state}}></script>
        <script src={this.props.clientFile}></script>
        <div id="app" dangerouslySetInnerHTML={{__html: this.props.markup}}></div>
      </div>
    );
  }
}

export default Html;
