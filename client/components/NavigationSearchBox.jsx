import React, { PropTypes } from 'react';

const NavigationSearchBox = ({ text, placeholder, iconCode, handleTextChange, handleSubmit, handleIconClick }) =>
  <form
    id="search" role="search" className="search-form"
    autoComplete="off" onSubmit={handleSubmit}
  >
    <div className="navigation-bar-search form-group search-control">
      <label htmlFor="nav-search-input">
        <i
          className={`icon-budicon-${iconCode} visible-xs-inline-block`}
          onClick={handleIconClick}
        />
        <i className="icon-budicon-489 hidden-xs" />
      </label>
      <input
        id="nav-search-input" className="search-input form-control" type="text"
        placeholder={placeholder} value={text} onChange={handleTextChange}
      />
    </div>
  </form>;

NavigationSearchBox.propTypes = {
  text: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  iconCode: PropTypes.number.isRequired,
  handleTextChange: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  handleIconClick: PropTypes.func.isRequired
};

export default NavigationSearchBox;
