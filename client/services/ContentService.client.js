import { parse, format } from 'url';
import API from './API.client.js';

const ContentService = {};

ContentService.load = (url) => {
  const requestUrl = parse(url);
  if (!requestUrl.query) requestUrl.query = {};
  requestUrl.query.e = 1;

  return API.get(format(requestUrl));
};

export default ContentService;
