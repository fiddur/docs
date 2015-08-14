import request from 'request';
import util from 'util';
import d from 'debug';

const zendeskUrlFormat = 'https://%s.zendesk.com/api/v2';
var debug = d('docs:zendesk-client');

export default class ZendeskClient {
  constructor(tenant, apiEmail, apiToken) {
    this.token = new Buffer(apiEmail + '/token:' + apiToken).toString('base64');
    this.zendeskRootUrl = util.format(zendeskUrlFormat, tenant);
  }


  // @param ticket
  // {
  //   requester: {
  //     name:       'user name',
  //     email:      'user@example.com'
  //   },
  //   subject:      'subject',
  //   comment: {
  //     body:       'body'
  //   }
  // }
  postSupportTicket(ticket) {
    return new Promise((resolve, reject) => {
      request({
        url: util.format('%s/tickets.json', this.zendeskRootUrl),
        method: 'POST',
        headers: {
          'Authorization': 'Basic ' + this.token
        },
        json: { ticket: ticket }
      }, function(err, response, body) {
        if (err || response.statusCode !== 201) {
          debug('zendesk/chat.postMessage: ' + JSON.stringify(body));
          return reject(err || 'Status code: ' + response.statusCode);
        }
        resolve(body);
      });
    });
  }
}
