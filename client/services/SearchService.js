const SearchService = {};

const postRequest = (requestUrl, body) =>
  fetch(requestUrl, {
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

    const error = new Error(response.statusText);
    error.statusCode = response.status;
    error.response = response;
    throw error;
  })
  .then(response => response.json());

const pingUrl = (url, callback) => {
  const img = new Image();
  img.onload = img.onerror = function onError() {
    callback();
  };
  img.src = url;
};

const baseUrl = 'https://api.swiftype.com';

SearchService.search = (query) => {
  const requestUrl = `${baseUrl}/api/v1/public/engines/search`;

  const body = {
    engine_key: window.env.SWIFTYPE_ENGINE_KEY,
    q: query,
    spelling: 'retry',
    filters: {
      page: {
        type: ['article']
      }
    }
  };

  return postRequest(requestUrl, body);
};

SearchService.recordClickthrough = (query, id) => {
  const requestUrl = '/search/clickthrough';

  const params = {
    t: new Date().getTime(),
    engine_key: window.env.SWIFTYPE_ENGINE_KEY,
    doc_id: id,
    q: query
  };

  const urlParams = $.param(params);
  const url = `${baseUrl}/api/v1/public/analytics/pc?${urlParams}`;
  return new Promise((resolve) => pingUrl(url, resolve));
};

export default SearchService;
