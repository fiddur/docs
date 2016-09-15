import React from 'react';
import {navigateAction} from 'fluxible-router';
import performSearchAction from '../action/performSearch';

class SearchBox extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      text: props.text,
      focused: false,
      iconCode: 489
    };

    this.handleClick = this.handleClick.bind(this);
  }

  componentWillReceiveProps(newProps) {
    if (newProps.text && this.state.text !== newProps.text) {
      this.setState({text: newProps.text});
    }
  }

  handleTextChange(evt) {
    this.setState({text: evt.target.value});
  }

  handleSubmit(evt) {
    evt.preventDefault();
    this.refs.input.blur();
    let query = this.state.text;
    this.context.executeAction(performSearchAction, {query});
    this.context.executeAction(navigateAction, {url: '/docs/search?q=' + query});
  }

  handleClick() {
    this.props.handleOnClick();
    this.setState({
      iconCode: this.state.iconCode === 489 ? 471 : 489
    });
  }

  render() {

    let {placeholder, className} = this.props;
    let {text} = this.state;

    let classes = ['form-group', 'search-control'];
    if (className) classes.push(className);

    return (
      <form
        id="search"
        role="search"
        autoComplete="off"
        onSubmit={this.handleSubmit.bind(this)}
      >
        <div className={classes.join(' ')}>
          <i className={`icon-budicon-${this.state.iconCode}`} onClick={this.handleClick}/>
          <input
            id="search-input"
            ref="input"
            className="search-input form-control"
            type="text"
            placeholder={placeholder}
            value={text}
            onChange={this.handleTextChange.bind(this)}
          />
        </div>
      </form>
    );

  }

}

SearchBox.contextTypes = {
  executeAction: React.PropTypes.func
};

SearchBox.defaultProps = {
  placeholder: 'Search for docs',
  text: ''
};

SearchBox.propTypes = {
  handleOnClick: React.PropTypes.func
};

export default SearchBox;
