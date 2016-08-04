import React from 'react';
import ReactCSSTransitionGroup from 'react/lib/ReactCSSTransitionGroup';

const LOCAL_STORAGE_KEY = 'intro-dismissed';

class IntroBanner extends React.Component {

  constructor(props) {
    super(props)
    this.state = {dismissed: true};
  }

  componentDidMount() {
    let dismissed = window.localStorage.getItem(LOCAL_STORAGE_KEY);
    this.setState({dismissed});
  }

  handleCloseClick() {
    window.localStorage.setItem(LOCAL_STORAGE_KEY, true);
    this.setState({dismissed: true});
  }

  render() {

    let content = undefined;
    if (!this.state.dismissed) {
      content = (
        <div className='intro-banner'>
          <i className="intro-banner-close icon-budicon-471" onClick={this.handleCloseClick.bind(this)} />
          <div className="intro-banner-image"></div>
          <div className="intro-banner-text">
            <p>New to Auth0 and JSON Web Tokens?</p>
            <p>Take a quick tour.</p>
          </div>
          <div className="intro-banner-buttons">
            <a className="btn btn-success" href="/docs/overview">Auth0 Overview</a>
            <a className="btn btn-transparent" href="https://jwt.io/introduction" target="_blank">JSON Web Token Basics</a>
          </div>
        </div>
      );
    }

    return (
      <ReactCSSTransitionGroup transitionName="intro-banner" transitionEnterTimeout={1000} transitionLeaveTimeout={1000}>
        {content}
      </ReactCSSTransitionGroup>
    );
  }

}

export default IntroBanner;
