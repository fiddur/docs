import React from 'react';

var FeedbackSender = () => (
  <div className="feedback-sender js-feedback-sender">
    <h4>Is this content helpful?</h4>
    <div className="feedback-choose">
      <div className="choose choose-yes"><a href=""><i className="icon-budicon-470"></i>Yes</a></div>
      <div className="choose choose-no"><a href=""><i className="icon-budicon-471"></i>No</a></div>
    </div>
    <div style={{display: 'none'}} className="feedback-yes">
      <p>Thank you for your feedback!</p>
    </div>
    <div style={{display: 'none'}} className="feedback-no">
      <form className="send-feedback">
        <textarea placeholder="Sorry to hear that!, how can we help you?" className="form-control"></textarea>
        <input type="submit" value="Submit" className="submit btn btn-primary"/>
      </form>
    </div>
  </div>
);

export default FeedbackSender;
