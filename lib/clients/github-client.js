import request from 'request';
import d from 'debug';

var debug = d('docs:github-client');

const slackRootUrl = 'https://api.github.com';

export default class SlackClient {
  constructor(username, password) {
    this.token = new Buffer(username + ':' + password).toString('base64')
  }

  createIssue(org, repo, issue) {
    var url = `${slackRootUrl}/repos/${org}/${repo}/issues`;
    return new Promise((resolve, reject) => {
      request.post({
        url: url,
        json: issue,
        headers: {
          'Authorization': 'Basic ' + this.token,
          'User-Agent': 'Auth0 Docs Bot'
        }
      }, function(err, response, body) {
        if (err || response.statusCode !== 201) {
          debug('github/createIssue: ' + JSON.stringify(body));
          return reject(err || 'Status code: ' + response.statusCode);
        }
        return resolve(body);
      });
    });
  }
}
