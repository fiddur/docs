import React, { PropTypes } from 'react';
import Platform from './Platform';

const CurrentTypePlatforms = ({ platforms, quickstart, isFramedMode }) =>
  <ul className="circle-list">
    {
      platforms.map(platform =>
        <Platform key={platform.title} quickstart={quickstart} platform={platform} />
      )
    }
  </ul>;

CurrentTypePlatforms.propTypes = {
  platforms: PropTypes.array.isRequired,
  quickstart: PropTypes.object.isRequired,
  isFramedMode: PropTypes.bool.isRequired
};

export default CurrentTypePlatforms;
