import React, { PropTypes } from 'react';
import { navigateAction } from 'fluxible-router';
import performSearchAction from '../action/performSearch';

class NavigationSearchBox extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      text: props.text
    };
    this.handleTextChange = this.handleTextChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentWillReceiveProps(newProps) {
    if (newProps.text && this.state.text !== newProps.text) {
      this.setState({ text: newProps.text });
    }
  }

  handleTextChange(evt) {
    this.setState({ text: evt.target.value });
  }

  handleSubmit(evt) {
    evt.preventDefault();
    this.input.blur();
    let query = this.state.text;
    this.context.executeAction(performSearchAction, { query });
    this.context.executeAction(navigateAction, { url: '/docs/search?q=' + query });
  }

  render() {
    let { placeholder, className } = this.props;
    let { text, focused } = this.state;

    let classes = ['form-group', 'search-control'];
    if (className) classes.push(className);

    return (
      <form
        id="search"
        role="search"
        className="search-form"
        autoComplete="off"
        onSubmit={this.handleSubmit}
      >
        <div className={classes.join(' ')}>
          <label htmlFor="nav-search-input">
            <i
              className={`icon-budicon-${this.props.iconCode} visible-xs-inline-block`}
              onClick={this.props.handleIconClick}
            />
            <i className="icon-budicon-489 hidden-xs" />
          </label>
          <input
            id="nav-search-input"
            ref={(elem) => { this.input = elem; }}
            className="search-input form-control"
            type="text"
            placeholder={placeholder}
            value={text}
            onChange={this.handleTextChange}
          />
        </div>
      </form>
    );
  }

}

NavigationSearchBox.contextTypes = {
  executeAction: React.PropTypes.func
};

NavigationSearchBox.propTypes = {
  iconCode: PropTypes.number,
  handleIconClick: PropTypes.func.isRequired,
  placeholder: PropTypes.string.isRequired,
  text: PropTypes.string
};

export default NavigationSearchBox;
