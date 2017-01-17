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

const appendQuickstartSuggest = (acc, current, i, quickstart, searchTerm) => {
  const currentPlatformMatch = nameMatchSearch(quickstart.platforms[current].title, searchTerm);

  // Append <QuickstartSuggest> before the first hidden item
  if (!currentPlatformMatch) return acc.concat('quickstart-suggest', current);

  // If all the platforms are visible append <QuickstartSuggest> as last item
  if (i === Object.keys(quickstart.platforms).length - 1 && currentPlatformMatch) {
    return acc.concat(current, 'quickstart-suggest');
  }

  return acc.concat(current);
};

const mapPlatforms = (platformName, i, quickstart, isFramedMode, searchTerm) => {
  if (platformName === 'quickstart-suggest') {
    return (
      <QuickstartSuggest
        key="suggest-quickstart"
        delay={platformDelay * Object.keys(quickstart.platforms).length}
        name={quickstart.name}
      />
    );
  }

  return (
    <Platform
      key={quickstart.platforms[platformName] + i}
      delay={platformDelay * i}
      quickstart={quickstart}
      platform={quickstart.platforms[platformName]}
      isFramedMode={isFramedMode}
      hide={!!searchTerm && !nameMatchSearch(quickstart.platforms[platformName].title, searchTerm)}
    />
  );
};

const PlatformList = ({ quickstart, isFramedMode, searchTerm }) => {
  const items = Object.keys(quickstart.platforms)
    // Sort by visibility, show first the visible platforms
    .sort((platformA, platformB) => sortPlatforms(platformA, platformB, quickstart, searchTerm))
    // Append quickstart-suggest key after visible platforms
    .reduce((acc, current, i) => appendQuickstartSuggest(acc, current, i, quickstart, searchTerm), [])
    // Replace each platform name for the <Platform> component
    .map((platformName, i) => mapPlatforms(platformName, i, quickstart, isFramedMode, searchTerm));

  return (
    <div className="container techlist">
      <ul className="circle-list">{items}</ul>
    </div>
  );
};

PlatformList.propTypes = {
  quickstart: PropTypes.object,
  isFramedMode: PropTypes.bool.isRequired,
  searchTerm: PropTypes.string
};

export default PlatformList;
