import React from 'react';

let TryBanner = (props) => (
  <div id="try-banner">
    <div className="try-banner try-banner-alt">
      <span>Try Auth0 for FREE</span>
      <a href="javascript:signup()" className="btn btn-success btn-lg">Create free Account</a>
    </div>
  </div>  
);

export default TryBanner;
