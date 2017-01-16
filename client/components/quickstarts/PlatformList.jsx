import React, { PropTypes } from 'react';
import Platform from './Platform';
import QuickstartSuggest from './QuickstartSuggest';

const quickstartDelay = 20;

const PlatformList = ({ quickstart, isFramedMode, searchTerm }) => {
  const items = Object.keys(quickstart.platforms)
    .filter(name => name.toLowerCase().includes(searchTerm.toLowerCase()))
    .map((name, i) => (
      <Platform
        key={quickstart.name + i}
        delay={quickstartDelay * i}
        quickstart={quickstart}
        platform={quickstart.platforms[name]}
        isFramedMode={isFramedMode}
      />
    ))
    .concat(
      <QuickstartSuggest
        key="suggest-quickstart"
        delay={quickstartDelay * Object.keys(quickstart.platforms).length}
        name={quickstart.name}
      />
    );

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
