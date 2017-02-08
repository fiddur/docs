import React, { PropTypes } from 'react';
import _ from 'lodash';
import Platform from './Platform';

// Platform CSS animation delay
const platformDelay = 20;

const nameMatchSearch = (name, search) => name.toLowerCase().includes(search.toLowerCase());

const getPlatformsByVisibility = (platforms, searchTerm) =>
  platforms.filter(platform => nameMatchSearch(platform.title, searchTerm));

const mapPlatforms = (platforms, quickstart, isFramedMode, searchActive) =>
  platforms.map((platform, i) =>
    <Platform
      key={platform.title}
      delay={searchActive ? 0 : platformDelay * i}
      quickstart={quickstart}
      platform={platform}
      isFramedMode={isFramedMode}
    />);

const PlatformList = ({
    quickstart, quickstarts, isFramedMode, searchTerm, searchActive, handleSuggestClick
  }) => {
  const currentPlatformType = quickstart.name;
  const currentTypePlatforms = Object.keys(quickstarts[currentPlatformType].platforms)
    .map(platformName => quickstarts[currentPlatformType].platforms[platformName]);

  const visibleCurrentTypePlatforms = _.sortBy(
    getPlatformsByVisibility(currentTypePlatforms, searchTerm),
    platform => platform.title
  );

  const otherTypesPlatforms = _.values(quickstarts)
    .filter(quickstartType => quickstartType.name !== quickstart.name)
    .map(quickstartType =>
      Object.assign({}, quickstartType, {
        platforms: getPlatformsByVisibility(_.values(quickstartType.platforms), searchTerm)
      })
    );

  return (
    <div className="container techlist">
      {
        visibleCurrentTypePlatforms.length ? (
          <ul className="circle-list">
            { mapPlatforms(visibleCurrentTypePlatforms, quickstart, isFramedMode, searchActive) }
          </ul>
        ) : (
          <h5>There are no results in this quickstart type.</h5>
        )
      }
      { searchTerm &&
        otherTypesPlatforms.map(platformType => {
          if (!platformType.platforms.length) return null;

          return (
            <div>
              <h4>{ platformType.title }</h4>
              { platformType.platforms.slice(0, 3).map(platform => <h5>{ platform.title }</h5>) }
            </div>
          );
        })
      }
    </div>
  );
};

PlatformList.propTypes = {
  quickstart: PropTypes.object.isRequired,
  quickstarts: PropTypes.object.isRequired,
  isFramedMode: PropTypes.bool.isRequired,
  searchTerm: PropTypes.string.isRequired,
  searchActive: PropTypes.bool.isRequired,
  handleSuggestClick: PropTypes.func.isRequired
};

export default PlatformList;
