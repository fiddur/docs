let SearchService = {};

const engineKey = 's-M2Jb8-xTC1XeyCpWZ1';

SearchService.search = (query) => {

  let requestUrl = `https://api.swiftype.com/api/v1/public/engines/search?q=${query}&engine_key=${engineKey}`;

  return fetch(requestUrl)
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
