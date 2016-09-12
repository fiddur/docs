import request from 'request';
import util from 'util';
import d from 'debug';

var debug = d('docs:slack-client');

export default class SlackClient {
  constructor(webhookUrl) {
    this.webhookUrl = webhookUrl;
  }

  postSlackMessage(message) {
    if (message.attachments) {
      message.attachments = message.attachments;
    }

    return new Promise((resolve, reject) => {
      request({
        url: this.webhookUrl,
        json: message,
        method: 'POST',
      }, function(err, response, body) {
        if (err || response.statusCode !== 200) {
          debug('slack/chat.postMessage: ' + JSON.stringify(body));
          return reject(err || 'Status code: ' + response.statusCode);
        }
        return resolve(body);
      });
    });
  }
}
