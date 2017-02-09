import React, { PropTypes } from 'react';
import Platform from './Platform';

const CurrentTypePlatforms = ({ platforms, quickstart, isFramedMode }) => {
  if (!platforms.length) {
    return <h5 className="platforms-no-results">There are no results in this quickstart type.</h5>;
  }
  return (
    <ul className="circle-list">
      {
        platforms.map(platform =>
          <Platform
            key={platform.title} quickstart={quickstart}
            platform={platform} isFramedMode={isFramedMode}
          />
        )
      }
    </ul>
  );
};

CurrentTypePlatforms.propTypes = {
  platforms: PropTypes.array.isRequired,
  quickstart: PropTypes.object.isRequired,
  isFramedMode: PropTypes.bool.isRequired
};

export default CurrentTypePlatforms;
