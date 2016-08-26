import React from 'react';
import {navigateAction} from 'fluxible-router';
import performSearchAction from '../action/performSearch';

class SearchBox extends React.Component {

  constructor(props) {
    super(props);
    this.state = {text: ''};
  }

  handleTextChange(evt) {
    this.setState({text: evt.target.value});
  }

  handleSubmit(evt) {
    evt.preventDefault();
    let query = this.state.text;
    this.setState({text: ''}, () => {
      this.context.executeAction(performSearchAction, {query});
      this.context.executeAction(navigateAction, {url: '/docs/search?q=' + query});
    });
  }

  render() {

    let {placeholder} = this.props;
    let {text} = this.state;

    return (
      <form id="search" role="search" autoComplete="off" onSubmit={this.handleSubmit.bind(this)}>
        <div className="form-group search-control">
          <i className="icon-budicon-489" />
          <input
            id="search-input"
            className="search-input form-control"
            type="text"
            placeholder={placeholder}
            text={text}
            onChange={this.handleTextChange.bind(this)} />
        </div>
      </form>
    );

  }

}

SearchBox.contextTypes = {
  executeAction: React.PropTypes.func
};

SearchBox.defaultProps = {
  placeholder: "Search for docs"
};

export default SearchBox;
