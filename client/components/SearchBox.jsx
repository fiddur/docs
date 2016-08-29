import React from 'react';
import {navigateAction} from 'fluxible-router';
import performSearchAction from '../action/performSearch';

class SearchBox extends React.Component {

  constructor(props) {
    super(props);
    this.state = {text: props.text, focused: false};
  }

  componentWillReceiveProps(newProps) {
    if (newProps.text && this.state.text !== newProps.text) {
      this.setState({text: newProps.text});
    }
  }

  handleFocusChanged(focused) {
    this.setState({focused});
    if (focused) this.refs.input.select();
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

  render() {

    let {placeholder, className} = this.props;
    let {text, focused} = this.state;

    let classes = ['form-group', 'search-control'];
    if (focused) classes.push('focused');
    if (className) classes.push(className);

    return (
      <form id="search" role="search" autoComplete="off" onSubmit={this.handleSubmit.bind(this)}>
        <div className={classes.join(' ')}>
          <i className="icon-budicon-489" />
          <input
            id="search-input"
            ref="input"
            className="search-input form-control"
            type="text"
            placeholder={placeholder}
            text={text}
            onChange={this.handleTextChange.bind(this)}
            onFocus={this.handleFocusChanged.bind(this, true)}
            onBlur={this.handleFocusChanged.bind(this, false)} />
        </div>
      </form>
    );

  }

}

SearchBox.contextTypes = {
  executeAction: React.PropTypes.func
};

SearchBox.defaultProps = {
  placeholder: "Search for docs",
  text: ""
};

export default SearchBox;
