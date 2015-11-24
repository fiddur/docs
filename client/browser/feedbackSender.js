/* global $ */

export default function feedbackSender() {
  var submitFeedback = function(positive, comment) {
    var pageTitle = document.title;
    var titleParts = document.title.split('-');
    if (titleParts.length > 0) {
      pageTitle = titleParts[0].trim();
    }
    var feedback = {
      page_title: pageTitle,
      page_url: window.location.href,
      positive: positive,
      comment: comment
    };
    $.post('/docs/submit-feedback', feedback);
  };

  $('.js-feedback-sender .choose').unbind('click').one('click', function(e) {
    e.preventDefault();

    $('.feedback-choose').hide();
    if ($(this).hasClass('choose-yes')) {
      $('.feedback-yes').show();
      submitFeedback(true);
    } else {
      $('.feedback-no').show();
    }
  });

  $('.js-feedback-sender form').unbind('submit').one('submit', function(e) {
    e.preventDefault();
    $('.feedback-no').hide();
    $('.feedback-yes').show();
    submitFeedback(false, e.target[0].value);
  });
}
