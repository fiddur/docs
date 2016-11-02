import assert from 'assert';
import urljoin from 'url-join';

/**
 * Normalizes URLs to ensure they are absolute, and optionally point to a CDN.
 */
class UrlFormatter {

  /**
   * Creates a UrlFormatter.
   * @param {Object} options - An options hash.
   * @param {String} options.baseUrl - The base URL for the site.
   * @param {String} [options.mediaUrl] - The base URL for media files (CDN).
   * @param {String} [options.mediaPrefix] - The relative prefix for media files.
   */
  constructor(options = {}) {
    assert(options.baseUrl, 'UrlFormatter constructor requires a baseUrl option');
    this.baseUrl = options.baseUrl;
    this.mediaUrl = options.mediaUrl;
    this.mediaPrefix = options.mediaPrefix || UrlFormatter.defaults.mediaPrefix;
  }

  /**
   * Normalizes the specified URL.
   * @param {String} url - The URL to normalize.
   * @returns {String} The formatted URL.
   */
  format(url) {
    // If the URL is falsy, return undefined so JSON serialization will omit it.
    if (!url) return undefined;
    // If the URL is already absolute, don't modify it.
    if (/^(?:[a-z]+:)?\/\//i.test(url)) return url;
    // Replace the media prefix with the media base URL, if we have one.
    if (this.mediaUrl && url.indexOf(this.mediaPrefix) === 0) {
      return urljoin(this.mediaUrl, url.replace(this.mediaPrefix, ''));
    }
    // Otherwise, just prepend the URL with the base URL.
    return urljoin(this.baseUrl, url);
  }

}

UrlFormatter.defaults = {
  mediaPrefix: '/media'
};

export default UrlFormatter;
