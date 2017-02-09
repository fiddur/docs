import React, { PropTypes } from 'react';

const OtherTypesPlatforms = (props) => {
  const { quickstartTypes, handleSuggestClick, currentQuickstartType } = props;

  const platforms = quickstartTypes
    .map(quickstartType => quickstartType.platforms) // Get visible platforms of each type
    .reduce((acc, current) => acc.concat(current), []); // Flatten array

  return (
    <div className="other-types-platforms">
      <div className="empty-state-section">
        <span className="empty-state-icon icon icon-budicon-490" />
        <h3 className="empty-state-title">
          There are no matches in the
          <span className="bold">{` ${currentQuickstartType} `}</span>
          category but there are matches in other categories.
        </h3>
      </div>
      {
        platforms.length &&
          <ul className="other-platforms-list">
            {
              quickstartTypes.map(quickstartType =>
                quickstartType.platforms.map(platform =>
                  <li
                    className="circle-logo other-platforms-item"
                    data-name={platform.logo_name || platform.name}
                  >
                    <div className="logo" />
                    <span className="title">{ platform.title }</span>
                    <span className="from-category">from {quickstartType.title}</span>
                  </li>
                )
              )
            }
          </ul>
      }
      <div className="suggest-quickstart-section">
        <span className="text"> Not what you are looking for?</span>
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
