import React, { PropTypes } from 'react';
import _ from 'lodash';
import Platform from './Platform';
import QuickstartSuggest from './QuickstartSuggest';

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

const appendQuickstartSuggest = (acc, current, i, arr, quickstart, searchTerm) => {
  // Find the index of the first hidden platform (not matched)
  const firstHiddenIndex = _.findIndex(
    arr,
    platformName => !nameMatchSearch(quickstart.platforms[platformName].title, searchTerm)
  );

  if (i === firstHiddenIndex) return acc.concat('quickstart-suggest', current);
  if ((i === arr.length - 1) && (firstHiddenIndex === -1)) {
    return acc.concat(current, 'quickstart-suggest');
  }
  return acc.concat(current);
};

const mapPlatforms = (platformName, i, quickstart, isFramedMode, searchTerm, searchActive) => {
  return (platformName === 'quickstart-suggest') ? (
    <QuickstartSuggest
      key="quickstart-suggest"
      delay={searchActive ? 0 : platformDelay * Object.keys(quickstart.platforms).length}
      name={quickstart.name}
    />
  ) : (
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

const PlatformList = ({ quickstart, isFramedMode, searchTerm, searchActive }) => {
  const items = Object.keys(quickstart.platforms)
    // Sort by visibility, show first the visible platforms
    .sort((platformA, platformB) => sortPlatforms(platformA, platformB, quickstart, searchTerm))
    // Append quickstart-suggest key after visible platforms (matched by search)
    .reduce((acc, current, i, arr) => appendQuickstartSuggest(acc, current, i, arr, quickstart, searchTerm), [])
    // Replace each platform name for the <Platform> component or <QuickstartSuggest>
    .map((platformName, i) => mapPlatforms(platformName, i, quickstart, isFramedMode, searchTerm, searchActive));

  return (
    <div className="container techlist">
      <ul className="circle-list">{items}</ul>
    </div>
  );
};

PlatformList.propTypes = {
  quickstart: PropTypes.object.isRequired,
  isFramedMode: PropTypes.bool.isRequired,
  searchTerm: PropTypes.string.isRequired,
  searchActive: PropTypes.bool.isRequired
};

export default PlatformList;
