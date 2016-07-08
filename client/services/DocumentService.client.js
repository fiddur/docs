let DocumentService = {};

DocumentService.loadDocument = (id) => {

  let url = id + "?e=1";

  return fetch(url, {credentials: 'include'})
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

export default DocumentService;
