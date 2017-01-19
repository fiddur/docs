import React, { PropTypes } from 'react';
import _ from 'lodash';
import Platform from './Platform';
import QuickstartSuggestItem from './QuickstartSuggestItem';

const platformDelay = 20;

const nameMatchSearch = (name, search) => name.toLowerCase().includes(search.toLowerCase());

const sortPlatforms = (platformA, platformB, quickstart, searchTerm) => {
  // If there is no search term maintain the order
  if (!searchTerm) return 0;

  const platformAMatch = nameMatchSearch(quickstart.platforms[platformA].title, searchTerm);
  const platformBMatch = nameMatchSearch(quickstart.platforms[platformB].title, searchTerm);

  // If the first platform is hidden (not matched) and the second
  // one is visible (matched) put the visible platform first
  return (!platformAMatch && platformBMatch) ? 1 : -1;
};

const appendQuickstartSuggest = (acc, current, i, arr, quickstart, firstHiddenIndex) => {
  if (i === firstHiddenIndex) return acc.concat('quickstart-suggest', current);
  if (i === arr.length - 1 && firstHiddenIndex === -1) {
    return acc.concat(current, 'quickstart-suggest');
  }
  return acc.concat(current);
};

// eslint-disable-next-line max-len
const mapPlatforms = (platformName, i, quickstart, isFramedMode, searchTerm, searchActive, handleSuggestClick) => {
  if (platformName === 'quickstart-suggest') {
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
  }

  return (
    <Platform
      key={quickstart.platforms[platformName].title}
      delay={searchActive ? 0 : platformDelay * i}
      quickstart={quickstart}
      platform={quickstart.platforms[platformName]}
      isFramedMode={isFramedMode}
      hide={!!searchTerm && !nameMatchSearch(quickstart.platforms[platformName].title, searchTerm)}
    />
  );
};

const PlatformList = ({
    quickstart, isFramedMode, searchTerm, searchActive, handleSuggestClick
  }) => {
  const items = Object.keys(quickstart.platforms);

  // Sort platforms by visibility, show first the visible ones
  const sortedItems = items.sort((platformA, platformB) =>
    sortPlatforms(platformA, platformB, quickstart, searchTerm));

  // Find the index of the first hidden platform (not matched) to append quickstart suggest
  const firstHiddenIndex = _.findIndex(
    sortedItems,
    platformName => !nameMatchSearch(quickstart.platforms[platformName].title, searchTerm)
  );

  // Append quickstart-suggest key after visible platforms (matched by search)
  const itemsWithSuggest = sortedItems.reduce((acc, current, i, arr) =>
    appendQuickstartSuggest(acc, current, i, arr, quickstart, firstHiddenIndex), []);

  // Replace each platform name for the <Platform> or <QuickstartSuggest> components
  const platforms = itemsWithSuggest.map((platformName, i) =>
    mapPlatforms(
      platformName, i, quickstart, isFramedMode, searchTerm, searchActive, handleSuggestClick
    ));

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
