import API from './API.client.js';

const ContentService = {};

ContentService.load = (url) => API.get(url);

export default ContentService;
