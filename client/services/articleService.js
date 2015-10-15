/* global window */
import { getPlatformSlug } from '../util/tutorials';

export default {
  loadArticle: function(payload) {
    var url = `${process.env.BASE_URL}/${getPlatformSlug(payload.appType)}/` +
              `${payload.currentTech}?${payload.appType}=${payload.tech1}&e=1`;

    if(payload.tech2) {
      url += '&api=' + payload.tech2;
    }

    if(payload.clientId) {
      url += '&a=' + payload.clientId;
    }

    return window.fetch(url)
    .then(function(response) {
      return response.text();
    });
  }
};
