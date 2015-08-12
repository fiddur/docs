import nconf from 'nconf';
import util from 'util';
import limitd from '../limitd';
import express from 'express';
import ZendeskClient from '../clients/zendesk-client';
import SlackClient from '../clients/slack-client';

var router = express.Router();

var endpoint = '/submit-feedback';


var slackClient;

if (nconf.get('SLACK_API_TOKEN') && nconf.get('SLACK_FEEDBACK_CHANNEL')) {
  slackClient = new SlackClient(nconf.get('SLACK_API_TOKEN'));
}

function postFeedbackToSlack(feedback, user) {
  if (!slackClient) {
    return;
  }

  var channelId = nconf.get('SLACK_FEEDBACK_CHANNEL');

  var text = util.format('%s feedback submitted by ', (feedback.positive === 'true' ? 'Positive' : 'Negative'));
  if (user) {
    text += util.format('%s (%s).', user.name, user.email);
  } else {
    text += 'an anonymous user.';
  }

  var message = {
    text: text,
    attachments: [
      {
        fallback: feedback.page_url + ': ' + feedback.comment,
        color: (feedback.positive === 'true' ? 'good' : 'danger'),
        title: feedback.page_title,
        title_link: feedback.page_url,
        text: feedback.comment
      }
    ]
  };
  slackClient.postSlackMessage(channelId, message)
  .then(result => {
    console.log(result);
  }).catch(err => {
    console.error(err);
  });
}

var zendeskClient;

if (nconf.get('ZENDESK_TENANT') && nconf.get('ZENDESK_API_EMAIL') && nconf.get('ZENDESK_API_TOKEN')) {
  zendeskClient = new ZendeskClient(
    nconf.get('ZENDESK_TENANT'), nconf.get('ZENDESK_API_EMAIL'),  nconf.get('ZENDESK_API_TOKEN'));
}

function postFeedbackToZendesk(feedback, user) {
  if (!zendeskClient) {
    return;
  }

  //TODO: Post to zendesk
}


router.use(endpoint, function(req, res, next) {
  if (!limitd) return next();

  limitd.take('submit feedback', req.ip, function(err, resp) {
    if (err) return next();
    if (resp && !resp.conformant) {
      return res.sendStatus(429);
    }
    next();
  });
});

router.post(endpoint, function(req, res) {
  if (req.body.page_url === undefined || req.body.positive === undefined) {
    return res.sendStatus(400);
  }

  console.log('message')
  postFeedbackToSlack(req.body, req.user);

  // If the feedback is negative and the user is logged in, open a ticket
  if (req.body.positive === 'false' && req.user) {
    postFeedbackToZendesk(req.body, req.user);
  }

  res.send(200);
});

export default router;
