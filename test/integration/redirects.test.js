import async from 'async';
import { expect } from 'chai';
import { isArray } from 'lodash';
import request from 'supertest';
import urljoin from 'url-join';
import ptr from 'path-to-regexp';
import redirects from '../../docs/config/redirects';

require('../../config');

describe('Configured redirects', function() {
  this.timeout(60000);

  let app;
  let cache;

  const sourceUrls = [];
  const targetUrls = new Set();

  const getDummyValueForParam = (param, index) => {
    // If the parameter is an option list, choose one of the options.
    if (param.indexOf('|') !== -1) {
      const matches = /\(([^)]+?)\)/.exec(param);
      const options = matches[1].split('|');
      return options[0];
    }

    // Otherwise, just fill in a random string.
    return `param${index}`;
  };

  before(done => {
    app = require('../../server');
    cache = require('../../lib/pipeline');

    // Build the list of "from" and "to" URLs that we need to test.
    redirects.forEach(item => {
      const froms = isArray(item.from) ? item.from : [item.from];
      froms.forEach(url => {
        let from = urljoin('/docs', url);
        let to = urljoin('/docs', item.to);
        // If the from URL has any parameters, fill them with dummy values in both the to and from URLs.
        const params = url.match(new RegExp('(:[^/]+)', 'g'));
        if (params) {
          params.forEach((param, index) => {
            const value = getDummyValueForParam(param, index);
            from = from.replace(param, value);
            to = to.replace(param, value);
          });
        }
        sourceUrls.push({ from, to, status: item.status || 301 });
      });
      targetUrls.add(item.to);
    });

    cache.whenReady(done);
  });

  describe('requests to the source (from) URLs', () => {
    it('result in redirects to the expected URLs', done => {
      const testSourceUrl = (url, next) => {
        request(app)
        .get(url.from)
        .expect('Location', url.to)
        .expect(url.status)
        .end(next);
      };
      async.eachSeries(sourceUrls, testSourceUrl, done);
    });
  });

  describe('requests to the target (to) URLs', () => {
    it('result in success', done => {
      const testTargetUrl = (url, next) => {
        request(app)
        .get(url)
        .expect(200)
        .end(next);
      };
      async.eachSeries(targetUrls, testTargetUrl, done);
    });
  });

});
