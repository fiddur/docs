import React, { Component, PropTypes } from 'react';
import { Button, Modal } from 'auth0-styleguide-react-components';

class QuickstartSuggest extends Component {
  constructor() {
    super();

    this.state = {
      showSuggestionModal: false
    };

    this.renderModal = this.renderModal.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.getStyle = this.getStyle.bind(this);
  }

  getStyle() {
    return {
      animationDelay: `${this.props.delay}ms`,
      WebkitAnimationDelay: `${this.props.delay}ms`,
      animationDuration: '200ms',
      WebkitAnimationDuration: '200ms',
      animationTimingFunction: 'cubic-bezier(0.455, 0.03, 0.515, 0.955)',
      WebkitAnimationTimingFunction: 'cubic-bezier(0.455, 0.03, 0.515, 0.955)'
    };
  }

  handleClick() {
    this.setState({
      showSuggestionModal: true
    });
  }

  renderModal(suggestionText) {
    return (
      <Modal
        show={this.state.showSuggestionModal}
        autoFocus
        onHide={() => {
          this.setState({ showSuggestionModal: false });
        }}
      >
        <Modal.Header
          bsClass="modal-header has-border"
          closeButton
        >
          <Modal.Title>Suggest {suggestionText}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="text-center" style={{ marginBottom: '32px' }}>
            Enter the name of the SDK you would like us to
            have and we will add it to our list.
          </p>
          <div className="row">
            <div className="col-xs-12 form-group form-horizontal">
              <label
                htmlFor="suggestion-name"
                className="control-label col-xs-2 text-left"
              >
                Name
              </label>
              <div className="col-xs-10">
                <input
                  className="input-block-level form-control"
                  id="suggestion-name"
                  name="Suggestion name"
                  autoFocus
                />
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button bsStyle="primary">Submit</Button>
        </Modal.Footer>
      </Modal>
    );
  }

  render() {
    const quickstartNameToSuggestion = {
      native: 'a SDK',
      spa: 'a technology',
      webapp: 'a technology',
      backend: 'an API'
    };
    const suggestionText = quickstartNameToSuggestion[this.props.name] || 'a quickstart';

    return (
      <div style={{ display: 'inline-block' }}>
        { this.renderModal(suggestionText) }
        <li className="animated scaleIn" style={this.getStyle()}>
          <div
            className="circle-logo suggest-quickstart"
            onClick={this.handleClick}
          >
            <div className="logo" />
            <div className="title">
              Suggest {suggestionText}
            </div>
          </div>
        </li>
      </div>
    );
  }
}

QuickstartSuggest.propTypes = {
  name: PropTypes.string.isRequired,
  delay: PropTypes.number.isRequired
};

export default QuickstartSuggest;
