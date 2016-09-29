import util from 'util';
import express from 'express';
import request from 'request';
import env from '../env';
import limitd from '../limitd';
import { logger } from '../logs';


const router = express.Router();

function postFeedbackToTrello(feedback, user) {
  if (!env.TRELLO_KEY || !env.TRELLO_TOKEN || !env.TRELLO_LIST_ID) {
    logger.warn('Trello is not configured.');
    return Promise.resolve();
  }

  if (feedback.positive === 'true') {
    logger.debug('Positive comments not posted to trello.');
    return Promise.resolve();
  }

  const body = [feedback.comment];
  if (user) {
    body.push(`Submitted by: ${user.name} <${user.email}>`);
  }

  const card = {
    name: feedback.page_title,
    desc: body.join('\n').trim(),
    idList: env.TRELLO_LIST_ID,
    idLabels: env.TRELLO_LABEL_ID,
    urlSource: feedback.page_url
  };

  const url = `https://api.trello.com/1/cards?key=${env.TRELLO_KEY}&token=${env.TRELLO_TOKEN}`;
  return new Promise((resolve, reject) => {
    request({
      url: url,
      json: card,
      method: 'POST'
    }, (err, response, body2) => {
      if (err || response.statusCode !== 200) {
        logger.error(`trello/card.create: ${JSON.stringify(body2)}`);
        return reject(err || `Status code: ${response.statusCode}`);
      }
      return resolve(body2);
    });
  }).catch(logger.error);
}

function postFeedbackToSlack(feedback, user) {
  if (!env.SLACK_WEBHOOK) {
    logger.warn('Slack is not configured.');
    return Promise.resolve();
  }

  let text = util.format('%s feedback submitted by ',
    (feedback.positive === 'true' ? 'Positive' : 'Negative'));
  if (user) {
    text += util.format('%s (%s).', user.name, user.email);
  } else {
    text += 'an anonymous user.';
  }

  const message = {
    text,
    attachments: [
      {
        fallback: `${feedback.page_url}: ${feedback.comment}`,
        color: (feedback.positive === 'true' ? 'good' : 'danger'),
        title: feedback.page_title,
        title_link: feedback.page_url,
        text: feedback.comment
      }
    ]
  };

  return new Promise((resolve, reject) => {
    request({
      url: env.SLACK_WEBHOOK,
      json: message,
      method: 'POST'
    }, (err, response, body) => {
      if (err || response.statusCode !== 200) {
        logger.debug(`slack/chat.postMessage: ${JSON.stringify(body)}`);
        return reject(err || `Status code: ${response.statusCode}`);
      }
      return resolve(body);
    });
  }).catch(logger.error);
}

// Feedback is in the format:
// var feedback = {
//   page_title: pageTitle,
//   page_url: window.location.href,
//   positive: 'true'|'false',
//   comment: comment
// };

router.post('/submit-feedback', (req, res) => {
  if (req.body.page_url === undefined || req.body.positive === undefined) {
    return res.sendStatus(400);
  }

  // Don't resolve promises, we just eat the error
  postFeedbackToSlack(req.body, req.user);
  postFeedbackToTrello(req.body, req.user);

  return res.sendStatus(200);
});

export default router;
