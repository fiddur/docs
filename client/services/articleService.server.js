import { getPlatformSlug } from '../util/tutorials';

export default function(req, res) {
  return {
    loadArticle: function(payload) {
      // var url = `${process.env.BASE_URL}/${getPlatformSlug(payload.appType)}/` +
      //           `${payload.currentTech}?${payload.appType}=${payload.tech1}&e=1`;
      //
      // if(payload.tech2) {
      //   url += '&api=' + payload.tech2;
      // }
      //
      // if(payload.clientId) {
      //   url += '&a=' + payload.clientId;
      // }
      //
      // // Client only
      // return $.ajax({
      //   url: url,
      //   dataType: 'jsonp',
      //   contentType: 'application/json'
      // });
      return Promise.resolve({
        html: '<h1>TEST</h1>'
      });
    }
  }
}
