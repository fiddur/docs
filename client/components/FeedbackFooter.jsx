import React from 'react';

const FeedbackFooterMode = {
  READY: 'READY',
  THANKS: 'THANKS',
  INPUT: 'INPUT'
};

const FeedbackButtonSelected = {
  NONE: 'NONE',
  YES: 'YES',
  NO: 'NO'
};

class FeedbackFooter extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      mode: FeedbackFooterMode.READY,
      selected: FeedbackButtonSelected.NONE
    };
  }

  componentWillUpdate(nextProps) {
    if (this.props.articleUrl !== nextProps.articleUrl) {
      this.setState({
        mode: FeedbackFooterMode.READY,
        selected: FeedbackButtonSelected.NONE
      });
    }
  }

  handleYesClick() {
    if (this.state.mode == FeedbackFooterMode.READY) {
      this.sendFeedback(true);
      this.setState({
        mode: FeedbackFooterMode.THANKS,
        selected: FeedbackButtonSelected.YES
      });
    }
  }

  handleNoClick() {
    if (this.state.mode == FeedbackFooterMode.READY) {
      this.setState({
        mode: FeedbackFooterMode.INPUT,
        selected: FeedbackButtonSelected.NO
      });
    }
  }

  handleFormSubmit(evt) {
    evt.preventDefault();
    this.sendFeedback(false, this.refs.comment.value);
    this.setState({mode: FeedbackFooterMode.THANKS});
  }

  sendFeedback(positive, comment) {
    let pageTitle = document.title;
    let titleParts = document.title.split('-');
    if (titleParts.length > 0) pageTitle = titleParts[0].trim();
    $.post('/docs/submit-feedback', {
      page_title: pageTitle,
      page_url: window.location.href,
      positive,
      comment
    });
    this.context.trackEvent('feedback:submit', {
      path: window.location.pathname,
      url: window.location.toString(),
      title: pageTitle,
      referrer: document.referrer,
      value: positive,
      trackData: comment
    });
  }

  renderContent() {
    let {mode} = this.state;
    if (mode == FeedbackFooterMode.READY) {
      return (
        <div className="feedback-message">
          Suggestions? Typos? <a className="edit-link" href={this.props.editUrl} target="_blank">Edit this document on GitHub</a>
        </div>
      );
    }
    else if (mode == FeedbackFooterMode.THANKS) {
      return (
        <div className="feedback-message">Thank you for your feedback!</div>
      );
    }
    else if (mode == FeedbackFooterMode.INPUT) {
      return (
        <div className="feedback-form">
          <form onSubmit={this.handleFormSubmit.bind(this)}>
            <textarea ref="comment" className="form-control" rows="3" placeholder="Sorry to hear that. How can we help you?"></textarea>
            <button type="submit" className="btn btn-primary">Send</button>
          </form>
        </div>
      );
    }
  }

  render() {

    let {selected} = this.state;

    return (
      <div className="feedback-footer">
        <div className="feedback-title">Was this article helpful?</div>
        <div className="feedback-buttons">
          <button className="feedback-button-yes btn btn-transparent" disabled={selected == FeedbackButtonSelected.NO} onClick={this.handleYesClick.bind(this)}>
            <span className="btn-icon icon-budicon-470"></span>
            Yes
          </button>
          <button className="feedback-button-no btn btn-transparent" disabled={selected == FeedbackButtonSelected.YES} onClick={this.handleNoClick.bind(this)}>
            <span className="btn-icon icon-budicon-471"></span>
            No
          </button>
        </div>
        <div className="feedback-content">
          {this.renderContent()}
        </div>
      </div>
    );

  }

}

FeedbackFooter.contextTypes = {
  trackEvent: React.PropTypes.func.isRequired
};

FeedbackFooter.propTypes = {
  articleUrl: React.PropTypes.string,
  editUrl: React.PropTypes.string
};

export default FeedbackFooter;
