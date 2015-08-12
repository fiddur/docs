import request from 'request';
import qs from 'querystring';
import util from 'util';

const slackRootUrl = 'https://slack.com/api';

export default class SlackClient {
  constructor(apiToken) {
    this.apiToken = apiToken;
  }

  postSlackMessage(channelId, message) {
    var url = util.format('%s/chat.postMessage?token=%s&channel=%s', slackRootUrl, this.apiToken, channelId);

    if (message.attachments) {
      message.attachments = JSON.stringify(message.attachments);
    }

    return new Promise((resolve, reject) => {
      request({
        url: url,
        form: message,
        method: 'POST',
      }, function(err, response, body) {
        if (err || response.statusCode !== 200) {
          console.error('slack/chat.postMessage: ' + JSON.stringify(body));
          return reject(err || 'Status code: ' + response.statusCode);
        }
        return resolve(body);
      });
    });
  }
}
