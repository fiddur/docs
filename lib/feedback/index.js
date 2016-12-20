import util from 'util';
import express from 'express';
import request from 'request';
import urljoin from 'url-join';
import env from '../env';
import limitd from '../limitd';
import { logger } from '../logs';

const QUICKSTART_URL_PREFIX = urljoin(env.DOMAIN_URL_DOCS, '/quickstart');
const router = new express.Router();

function postFeedbackToTrello(feedback, user, options) {
  if (!env.TRELLO_KEY || !env.TRELLO_TOKEN || !options.listId || !options.labelId) {
    logger.warn('Trello is not configured.');
    return Promise.resolve();
  }

  if (feedback.positive === 'true') {
    logger.debug('Positive comments not posted to trello.');
    return Promise.resolve();
  }

  const lines = [feedback.comment];
  if (user) {
    lines.push(`Submitted by: ${user.name} <${user.email}>`);
  }

  const desc = lines.join('\n').trim();
  if (!desc) {
    logger.debug('No contact info and no comment, so we don\'t open a trello card.');
    return Promise.resolve();
  }

  const card = {
    name: feedback.page_title,
    desc,
    idList: options.listId,
    idLabels: options.labelId,
    urlSource: feedback.page_url
  };

  const url = `https://api.trello.com/1/cards?key=${env.TRELLO_KEY}&token=${env.TRELLO_TOKEN}`;
  return new Promise((resolve, reject) => {
    request({
      url,
      json: card,
      method: 'POST'
    }, (err, response, body) => {
      if (err || response.statusCode !== 200) {
        logger.error(`trello/card.create: ${JSON.stringify(body)}`);
        return reject(err || `Status code: ${response.statusCode}`);
      }
      return resolve(body);
    });
  })
  .catch(logger.error);
}

function postFeedbackToSlack(feedback, user, options) {
  if (!options.webhookUrl) {
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
      url: options.webhookUrl,
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

  const section = req.body.page_url.startsWith(QUICKSTART_URL_PREFIX) ? 'QUICKSTARTS' : 'DOCS';

  // Don't resolve promises, we just eat the error
  postFeedbackToSlack(req.body, req.user, {
    webhookUrl: env[`SLACK_WEBHOOK_${section}`]
  });

  postFeedbackToTrello(req.body, req.user, {
    listId: env[`TRELLO_LIST_${section}`],
    labelId: env[`TRELLO_LABEL_${section}`]
  });

  return res.sendStatus(200);
});

export default router;
