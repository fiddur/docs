import {parse} from 'url';

let normalizeUrl = (url) => parse(url).pathname;

export default normalizeUrl;
