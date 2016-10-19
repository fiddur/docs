import _ from 'lodash';

let ArticleService = {};

ArticleService.loadArticle = function(quickstarts, payload) {
  
  let {quickstartId, platformId, articleId, clientId} = payload;

  let tokens = ['/docs'];
  if (quickstartId) tokens.push(quickstarts[quickstartId].slug);
  if (platformId)   tokens.push(platformId);
  if (articleId)    tokens.push(articleId);

  let url = tokens.join('/') + "?e=1";
  if (clientId) url += `&a=${clientId}`;
  
  function checkStatus(response) {
    if (response.status >= 200 && response.status < 400) {
      return response;
    }
    else {
      var error = new Error(response.statusText);
      error.status = response.status;
      error.response = response;
      throw error;
    }
  }

  return fetch(url, {credentials: 'include'})
  .then(checkStatus)
  .then(function(response) {
    return response.text();
  });
  
};

export default ArticleService;
