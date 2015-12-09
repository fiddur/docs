import React from 'react';
import ApplicationStore from '../stores/ApplicationStore';

class Html extends React.Component {
  render() {
    return (
      <div>
        <div id="app" style={{visibility: 'hidden' }} dangerouslySetInnerHTML={{__html: this.props.markup}}></div>
        <script dangerouslySetInnerHTML={{__html: this.props.state}}></script>
        <script src={this.props.clientFile}></script>
      </div>
    );
  }
}

export default Html;
