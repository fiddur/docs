let SearchService = {};

const engineKey = 's-M2Jb8-xTC1XeyCpWZ1';

SearchService.search = (query) => {

  let requestUrl = `https://api.swiftype.com/api/v1/public/engines/search?engine_key=${engineKey}`;

  var body = {
    'q': query,
    'filters':{
      'page': {
        'type':['article']
      }
    }
  };

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

export default SearchService;
