import React, { Component, PropTypes } from 'react';
import { Button, Modal } from 'auth0-styleguide-react-components';
import ModalLoader from '../ModalLoader';

class QuickstartSuggestModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      suggestion: props.suggestion,
      waitingResponse: false
    };

    this.handleSuggestionChange = this.handleSuggestionChange.bind(this);
    this.handleSuggestionSubmit = this.handleSuggestionSubmit.bind(this);
  }

  componentWillReceiveProps(props) {
    this.setState({
      suggestion: props.suggestion
    });
  }

  handleSuggestionChange(e) {
    this.setState({
      suggestion: e.target.value
    });
  }

  handleSuggestionSubmit() {
    if (this.state.waitingResponse) return;

    this.setState({
      waitingResponse: true
    });

    $.ajax({
      type: 'POST',
      url: 'https://wt-6047db103cbb5c1338ce4918051a7a70-0.run.webtask.io/quickstart-suggest-to-slack',
      data: JSON.stringify({
        data: {
          content: this.state.suggestion
        }
      }),
      processData: false,
      contentType: 'application/json',
      success: () => {
        this.setState({
          suggestion: '',
          waitingResponse: false
        });
        this.props.closeModal();
      },
      error: (error) => {
        this.setState({
          suggestion: '',
          waitingResponse: false
        });

        // eslint-disable-next-line no-console
        console.error('Your quickstart suggestion could not be sent.');
        this.props.closeModal();
      }
    });
  }

  render() {
    const { suggestion, waitingResponse } = this.state;

    return (
      <Modal
        show={this.props.open}
        autoFocus
        dialogClassName="quickstart-suggest-modal"
        onHide={this.props.closeModal}
      >
        <Modal.Header
          bsClass="modal-header has-border"
          closeButton
        >
          <Modal.Title>Suggest a quickstart</Modal.Title>
        </Modal.Header>
        <ModalLoader loading={waitingResponse}>
          <Modal.Body>
            <p className="text-center" style={{ marginBottom: '32px' }}>
              Enter the name of the quickstart you would like us to have <br />
              and we will add it to our list.
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
                    onChange={this.handleSuggestionChange}
                    value={suggestion}
                    autoFocus
                  />
                </div>
              </div>
            </div>
          </Modal.Body>
        </ModalLoader>
        <Modal.Footer>
          <Button
            bsStyle="primary"
            onClick={this.handleSuggestionSubmit}
            disabled={waitingResponse || !suggestion}
          >
            Submit
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

QuickstartSuggestModal.propTypes = {
  open: PropTypes.bool.isRequired,
  suggestion: PropTypes.string.isRequired,
  closeModal: PropTypes.func.isRequired
};

export default QuickstartSuggestModal;
