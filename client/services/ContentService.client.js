import {parse, format} from 'url';

let ContentService = {};

ContentService.load = (url) => {

  let requestUrl = parse(url);
  if (!requestUrl.query) requestUrl.query = {};
  requestUrl.query.e = 1;

  return fetch(format(requestUrl), {credentials: 'include'})
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
    return response.text();
  });

}

export default ContentService;
