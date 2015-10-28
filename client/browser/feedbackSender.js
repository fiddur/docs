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
    $.post(process.env.BASE_URL + '/submit-feedback', feedback);
  };

  $('.js-feedback-sender .choose').on('click', function(e) {
    e.preventDefault();

    $('.feedback-choose').hide();

    if ($(this).hasClass('choose-yes')) {
      submitFeedback(true);
      $('.feedback-yes').show();
    } else {
      $('.feedback-no').show();
    }
  });

  $('.js-feedback-sender form').submit(function(e) {
    e.preventDefault();

    if(!$(this).find('textarea').val()) {
      return alert('Please leave a comment before submitting');
    }

    submitFeedback(false, e.target[0].value);
    $('.feedback-no').hide();
    $('.feedback-yes').show();
  });
}
