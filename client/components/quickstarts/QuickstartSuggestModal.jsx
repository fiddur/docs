import React, { Component, PropTypes } from 'react';
import { Button, Modal } from 'auth0-styleguide-react-components';
import { connectToStores } from 'fluxible-addons-react';
import UserStore from '../../stores/UserStore.js';
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
      suggestion: e.target.value.substr(0, 80)
    });
  }

  handleSuggestionSubmit(e) {
    e.preventDefault();
    if (this.state.waitingResponse) return;

    this.setState({
      waitingResponse: true
    });

    const message = this.props.isAuthenticated ? (
`👤 *User*: ${this.props.user.account.userName}
✉️ *Email*: ${this.props.user.account.email}
🗣 *Suggestion*: ${this.state.suggestion}`
    ) : (
`👤 *Unauthenticated user*:
🗣 *Suggestion*: ${this.state.suggestion}`
    );

    const finishSubmit = () => {
      this.setState({
        suggestion: '',
        waitingResponse: false
      });
      this.props.closeModal();
    };

    this.context.trackEvent('quickstart-suggestion:submit', {
      path: window.location.pathname,
      url: window.location.toString(),
      title: document.title,
      trackData: this.state.suggestion
    });

    $.ajax({
      type: 'POST',
      url: 'https://wt-6047db103cbb5c1338ce4918051a7a70-0.run.webtask.io/quickstart-suggest-to-slack',
      data: JSON.stringify({
        data: {
          content: message
        }
      }),
      processData: false,
      contentType: 'application/json',
      success: () => {
        this.props.handleSuggestionSent();
        finishSubmit();
      },
      error: (error) => {
        // eslint-disable-next-line no-console
        console.error('Your quickstart suggestion could not be sent.');
        finishSubmit();
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
        <form onSubmit={this.handleSuggestionSubmit}>

          <ModalLoader loading={waitingResponse}>
            <Modal.Body>
              <p className="text-center" style={{ marginBottom: '32px' }}>
                Enter the name of the language or platform you would like <br />
                to suggest for a quickstart.
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
            <input
              type="submit"
              className="btn btn-primary"
              disabled={waitingResponse || !suggestion}
              value="Submit"
            />
          </Modal.Footer>

        </form>
      </Modal>
    );
  }
}

QuickstartSuggestModal.contextTypes = {
  trackEvent: PropTypes.func.isRequired
};

QuickstartSuggestModal.propTypes = {
  open: PropTypes.bool.isRequired,
  suggestion: PropTypes.string.isRequired,
  closeModal: PropTypes.func.isRequired,
  handleSuggestionSent: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
  user: PropTypes.object.isRequired
};

export default connectToStores(
  QuickstartSuggestModal,
  [UserStore],
  (context, props) => ({
    isAuthenticated: context.getStore(UserStore).isAuthenticated(),
    user: context.getStore(UserStore).getUser()
  })
);
