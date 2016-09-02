let SearchService = {};

const postRequest = (requestUrl, body) => {
  return fetch(requestUrl, {
    method: 'POST',
    headers: new Headers({
      'Content-Type': 'application/json'
    }),
    body: JSON.stringify(body)
  })
  .then(response => {
    if (response.status >= 200 && response.status < 400) {
      return response;
    }
    else {
      var error = new Error(response.statusText);
      error.status = response.status;
      error.response = response;
      throw error;
    }
  })
  .then(response => {
    return response.json();
  });
}

const pingUrl = (url, callback) => {
  var img = new Image();
  img.onload = img.onerror = function() {
    clearTimeout(to);
    callback();
  };
  img.src = url;
}

const baseUrl = 'https://api.swiftype.com';

SearchService.search = (query) => {

  let requestUrl = `${baseUrl}/api/v1/public/engines/search`;

  var body = {
    'engine_key': window.env.SWIFTYPE_ENGINE_KEY,
    'q': query,
    'filters':{
      'page': {
        'type':['article']
      }
    }
  };

  return postRequest(requestUrl, body);
}

SearchService.recordClickthrough = (query, id) => {
  let requestUrl = '/search/clickthrough';

  var params = {
    t: new Date().getTime(),
    engine_key: window.env.SWIFTYPE_ENGINE_KEY,
    doc_id: id,
    q: query,
  };

  var url = `${baseUrl}/api/v1/public/analytics/pc?` + $.param(params);
  return new Promise((resolve) => {
    return pingUrl(url, resolve);
  });
}

export default SearchService;
