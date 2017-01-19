import React, { PropTypes } from 'react';
import _ from 'lodash';
import Platform from './Platform';
import QuickstartSuggestItem from './QuickstartSuggestItem';

// Platform CSS animation delay
const platformDelay = 20;

const nameMatchSearch = (name, search) => name.toLowerCase().includes(search.toLowerCase());

const getPlatformsByVisibility = (platforms, visibility, quickstart, searchTerm) =>
  platforms.filter(item => {
    const platformTitle = quickstart.platforms[item].title;
    return nameMatchSearch(platformTitle, searchTerm) === visibility;
  });

const sortPlatformsAlphabetically = (list, quickstart) =>
  list.sort((a, b) => {
    const platformATitle = quickstart.platforms[a].title;
    const platformBTitle = quickstart.platforms[b].title;

    if (platformATitle < platformBTitle) return -1;
    if (platformATitle > platformBTitle) return 1;
    return 0;
  });

const mapPlatforms = (platforms, visible, quickstart, isFramedMode, searchActive) =>
  platforms.map((platformName, i) =>
    <Platform
      key={quickstart.platforms[platformName].title}
      delay={searchActive ? 0 : platformDelay * i}
      quickstart={quickstart}
      platform={quickstart.platforms[platformName]}
      isFramedMode={isFramedMode}
      hide={!visible}
    />);

const createQuickstartSuggest = (quickstart, searchTerm, handleSuggestClick, searchActive) => {
  const quickstartTypeToSuggestion = {
    native: 'a SDK',
    spa: 'a technology',
    webapp: 'a technology',
    backend: 'an API'
  };

  const suggestionText = `Suggest ${
    (searchTerm && `"${searchTerm}"`) ||
    quickstartTypeToSuggestion[quickstart.name] ||
    'a quickstart'
  }`;

  return (
    <QuickstartSuggestItem
      key="quickstart-suggest"
      title={suggestionText}
      delay={searchActive ? 0 : platformDelay * Object.keys(quickstart.platforms).length}
      handleClick={handleSuggestClick}
    />
  );
};

const PlatformList = ({
    quickstart, isFramedMode, searchTerm, searchActive, handleSuggestClick
  }) => {
  const items = Object.keys(quickstart.platforms);
  const visibleItems = getPlatformsByVisibility(items, true, quickstart, searchTerm);
  const hiddenItems = getPlatformsByVisibility(items, false, quickstart, searchTerm);
  const sortedVisibleItems = sortPlatformsAlphabetically(visibleItems, quickstart);
  const platforms = [
    ...mapPlatforms(sortedVisibleItems, true, quickstart, isFramedMode, searchActive),
    createQuickstartSuggest(quickstart, searchTerm, handleSuggestClick, searchActive),
    ...mapPlatforms(hiddenItems, false, quickstart, isFramedMode, searchActive)
  ];

  return (
    <div className="container techlist">
      <ul className="circle-list">{platforms}</ul>
    </div>
  );
};

PlatformList.propTypes = {
  quickstart: PropTypes.object.isRequired,
  isFramedMode: PropTypes.bool.isRequired,
  searchTerm: PropTypes.string.isRequired,
  searchActive: PropTypes.bool.isRequired,
  handleSuggestClick: PropTypes.func.isRequired
};

export default PlatformList;
