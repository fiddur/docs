const Api = {};

Api.get = (url) => {
  const headers = new Headers({
    'Content-Type': 'application/json'
  });
  return fetch(url, {
    headers,
    credentials: 'include'
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
};

export default Api;
