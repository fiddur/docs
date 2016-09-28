import React, { PropTypes } from 'react';


class NavigationSearchBox extends React.Component {

  componentWillReceiveProps(nextProps) {
    if (nextProps.searchActive) {
      this.input.focus();
    } else {
      this.input.blur();
    }
  }

  render() {
    const { text, placeholder, iconCode, handleTextChange, handleSubmit, handleIconClick } = this.props;
    return (
      <form
        id="search" role="search" className="search-form"
        autoComplete="off" onSubmit={handleSubmit}
      >
        <div className="navigation-bar-search form-group search-control">
          <label htmlFor="nav-search-input" onClick={handleIconClick}>
            <i
              className={`icon-budicon-${iconCode} visible-xs-inline-block`}
              onClick={this.handleIconClick}
            />
            <i className="icon-budicon-489 hidden-xs" />
          </label>
          <input
            id="nav-search-input" className="search-input form-control"
            type="text" placeholder={placeholder} value={text}
            onChange={handleTextChange} ref={(e) => { this.input = e; }}
          />
        </div>
      </form>
    );
  }
}

NavigationSearchBox.propTypes = {
  text: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  iconCode: PropTypes.number.isRequired,
  handleTextChange: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  handleIconClick: PropTypes.func.isRequired,
  searchActive: PropTypes.bool.isRequired
};

export default NavigationSearchBox;
