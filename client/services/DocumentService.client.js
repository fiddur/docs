import { parse, format } from 'url';
import Api from './Api';

const DocumentService = {};

DocumentService.load = (url, options = {}) => {
  const requestUrl = parse(url);

  if (!requestUrl.query) requestUrl.query = {};
  if (options.clientId) requestUrl.query.a = options.clientId;
  requestUrl.query.e = 1;

  return Api.get(format(requestUrl));
};

export default DocumentService;
