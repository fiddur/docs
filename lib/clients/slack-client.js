import request from 'request';
import util from 'util';
import d from 'debug';


const slackRootUrl = 'https://slack.com/api';
var debug = d('docs:slack-client');

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
          debug('slack/chat.postMessage: ' + JSON.stringify(body));
          return reject(err || 'Status code: ' + response.statusCode);
        }
        return resolve(body);
      });
    });
  }
}
