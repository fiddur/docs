import { parse } from 'url';

/**
 * This is just a simple utility function to ensure that we remove the
 * query string from a URL.
 */
const normalizeUrl = (url) => parse(url).pathname;

export default normalizeUrl;
