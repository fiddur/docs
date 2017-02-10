import React, { PropTypes } from 'react';
import Platform from './Platform';

const PlatformTypeList = ({ title, platforms, quickstart }) =>
  <div className="platforms-type-container">
    <h4 className="platforms-type-title">{ title }</h4>
    <ul className="platforms-type-list">
      {
        platforms.map(platform =>
          <Platform
            key={platform.title}
            quickstart={quickstart}
            platform={platform}
            otherType
          />
        )
      }
    </ul>
  </div>;

PlatformTypeList.propTypes = {
  title: PropTypes.string.isRequired,
  platforms: PropTypes.array.isRequired,
  quickstart: PropTypes.object.isRequired
};


const OtherTypesPlatforms = (props) => {
  const { quickstartTypes, handleSuggestClick, currentQuickstartType } = props;

  const anyResultMatch = !!quickstartTypes
    .map(quickstartType => quickstartType.platforms) // Get visible platforms of each type
    .reduce((acc, current) => acc.concat(current), []) // Flatten array
    .length;

  const getEmptyStateText = match => {
    if (!match) return 'There are no matches in any category.';

    return (
      <span>
        There are no matches in the
        <span className="bold"> {currentQuickstartType} </span>
        category but there are matches in other categories.
      </span>
    );
  };

  return (
    <div className="other-types-platforms">
      <div className="empty-state-section">
        <span className="empty-state-icon icon icon-budicon-490" />
        <h3 className="empty-state-title">{ getEmptyStateText(anyResultMatch) }</h3>
      </div>
      {
        anyResultMatch &&
          <div className="platforms-list-section">
            {
              quickstartTypes.map(quickstartType => {
                if (!quickstartType.platforms.length) return null;
                return (
                  <PlatformTypeList
                    title={quickstartType.title}
                    platforms={quickstartType.platforms}
                    quickstart={quickstartType}
                  />
                );
              })
            }
          </div>
      }
      <div className="suggest-quickstart-section">
        {anyResultMatch && <span className="text"> Not what you are looking for?</span>}
        <button className="btn btn-success"onClick={handleSuggestClick}>
          Suggest a new quickstart
        </button>
      </div>
    </div>
  );
};

OtherTypesPlatforms.propTypes = {
  quickstartTypes: PropTypes.array.isRequired,
  handleSuggestClick: PropTypes.func.isRequired,
  currentQuickstartType: PropTypes.string.isRequired
};

export default OtherTypesPlatforms;
