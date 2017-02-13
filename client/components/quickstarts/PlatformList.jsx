import React, { PropTypes } from 'react';
import { flow, values, filter, sortBy, map } from 'lodash';
import CurrentTypePlatforms from './CurrentTypePlatforms';
import OtherTypesPlatforms from './OtherTypesPlatforms';

const nameMatchSearch = (name, search) => name.toLowerCase().includes(search.toLowerCase());

const PlatformList = (props) => {
  const {
    quickstart, quickstarts, isFramedMode,
    searchTerm, searchActive, handleSuggestClick
  } = props;

  const filterVisiblePlatforms = platforms =>
    filter(platforms, platform => nameMatchSearch(platform.title, searchTerm));

  const sortPlatformsAlphabetically = platforms =>
    sortBy(platforms, platform => platform.title);

  const filterCurrentType = quickstartTypes =>
      filter(quickstartTypes, quickstartType => quickstartType.name !== quickstart.name);

  const filterQuickstartTypePlatforms = quickstartTypes =>
    map(quickstartTypes, quickstartType => Object.assign({}, quickstartType, {
      platforms: filterVisiblePlatforms(values(quickstartType.platforms), searchTerm)
    }));

  const platforms = flow(
    values,
    filterVisiblePlatforms,
    sortPlatformsAlphabetically
  )(quickstart.platforms);

  const otherTypesPlatforms = flow(
    values,
    filterCurrentType,
    filterQuickstartTypePlatforms
  )(quickstarts);

  return (
    <div className="container techlist">
      {
        platforms.length ? (
          <CurrentTypePlatforms
            platforms={platforms}
            quickstart={quickstart}
            isFramedMode={isFramedMode}
          />
        ) : (
          <OtherTypesPlatforms
            quickstartTypes={otherTypesPlatforms}
            handleSuggestClick={handleSuggestClick}
            currentQuickstartType={quickstart.title}
          />
        )
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
