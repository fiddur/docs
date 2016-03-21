import React from 'react';

var TryBanner = ({isAuthenticated}) => {
  var tryBanner = '';
  if (!isAuthenticated) {
    tryBanner = (
      <div id="try-banner">
        <div className="try-banner try-banner-alt">
          <span>Don't have an account yet?</span>
          <a href="javascript:signup()" className="btn btn-success btn-lg">Try Auth0 for Free</a>
        </div>
      </div>
    );
  }
  return tryBanner;
}

export default TryBanner;
