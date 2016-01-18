import nconf from 'nconf';
import util from 'util';
import limitd from '../limitd';
import express from 'express';
import winston from 'winston';
import ZendeskClient from '../clients/zendesk-client';
import SlackClient from '../clients/slack-client';
import GithubClient from '../clients/github-client';

var router = express.Router();

var endpoint = '/submit-feedback';


var slackClient;

if (nconf.get('SLACK_API_TOKEN') && nconf.get('SLACK_FEEDBACK_CHANNEL')) {
  slackClient = new SlackClient(nconf.get('SLACK_API_TOKEN'));
}

function postFeedbackToSlack(feedback, user) {
  if (!slackClient) {
    winston.warn('Slack client is not intialized.');
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
  slackClient.postSlackMessage(channelId, message).catch(winston.error);
}

var zendeskClient;

if (nconf.get('ZENDESK_TENANT') && nconf.get('ZENDESK_API_EMAIL') && nconf.get('ZENDESK_API_TOKEN')) {
  zendeskClient = new ZendeskClient(
    nconf.get('ZENDESK_TENANT'), nconf.get('ZENDESK_API_EMAIL'),  nconf.get('ZENDESK_API_TOKEN'));
}

function postFeedbackToZendesk(feedback, user) {
  if (!zendeskClient) {
    winston.warn('Zendesk client is not intialized.');
    return;
  }

  winston.info('Posting feedback to zendesk');

  var ticket = {
    requester: {
      name: user.name,
      email: user.email,
    },
    subject: 'Negative Feedback Submitted for: ' + feedback.page_title,
    custom_fields: [
      { id: '29992878', value: feedback.page_url } // Page URL
    ],
    comment: {
      body: feedback.comment || 'No comment provided.'
    }
  };

  zendeskClient.postSupportTicket(ticket)
  .catch(winston.error);
}

var githubClient;

if (nconf.get('GITHUB_API_USERNAME') && nconf.get('GITHUB_API_TOKEN') &&
    nconf.get('GITHUB_DOCS_ORG') && nconf.get('GITHUB_DOCS_REPO')) {
  githubClient = new GithubClient(nconf.get('GITHUB_API_USERNAME'), nconf.get('GITHUB_API_TOKEN'));
}

function postFeedbackToGithub(feedback, user) {
  if (!githubClient) {
    winston.warn('Github client is not intialized.');
    return;
  }

  var body = `Submitted by: ${user.name}
Page: [${feedback.page_title}](${feedback.page_url})

${feedback.comment}`;

  var issue = {
    title: 'Feedback Submitted for: ' + feedback.page_title,
    body: body
  };

  githubClient.createIssue(nconf.get('GITHUB_DOCS_ORG'), nconf.get('GITHUB_DOCS_REPO'), issue)
  .catch(winston.error);

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


// Feedback is in the format:
// var feedback = {
//   page_title: pageTitle,
//   page_url: window.location.href,
//   positive: 'true'|'false',
//   comment: comment
// };

router.post(endpoint, function(req, res) {
  if (req.body.page_url === undefined || req.body.positive === undefined) {
    return res.sendStatus(400);
  }

  if (req.user && req.user.email && req.user.email.indexOf(nconf.get('AUTH0_EMPLOYEE_EMAIL_DOMAIN')) > 0) {
    // Auth0 Employees send feedback to github issuess
    if (req.body.positive === 'false') {
      postFeedbackToGithub(req.body, req.user);
    }
  } else {
    // Everyone else posts to slack and zendesk
    postFeedbackToSlack(req.body, req.user);

    // If the feedback is negative and the user is logged in, open a ticket
    if (req.body.positive === 'false' && req.user) {
      postFeedbackToZendesk(req.body, req.user);
    }
  }

  res.sendStatus(200);
});

export default router;
