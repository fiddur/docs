import winston from 'winston';
import nconf from 'nconf';
import request from 'request';

const experimentsEndpoint = nconf.get('AB_EXPERIMENTS_ENDPOINT');
const cacheLifespan = 1000 * 60 * 3; // 3hs
const requestTimeout = 1000 * 2; // 2 seconds
let cache;
let pollTimer;

function doFetch (callback) {
  winston.debug('Purging experiments cache');
  cache = null;

  winston.debug('Fetching experiments from server');

  let requestOptions = {
    uri: experimentsEndpoint,
    timeout: requestTimeout
  };

  request.get(requestOptions, function(error, response, body) {
    if(error || response.statusCode !== 200) {
      winston.error('A/B Experiments fetch failed.\n%s', error.message);
      cache = null;
    } else {
      winston.debug('Experiments fetched. Executing callback');
      cache = body;
    }

    if (callback) {
      return callback();
    }
  });
}

function poll () {
  clearTimeout(pollTimer);
  pollTimer = setTimeout(doFetch, cacheLifespan, poll);
}

export default function fetchABExperiments (req, res, next) {
  cache = null;
  winston.debug('Loading Experiments');

  if (!experimentsEndpoint) {
    winston.debug('Experiments endpoint is not defined.');
    res.locals.abExperiments = cache;
    return next();
  }

  if (cache) {
    winston.debug('Returning cached experiments');
    res.locals.abExperiments = cache;
    return next();
  }

  doFetch(function () {
    res.locals.abExperiments = cache;
    poll();
    return next();
  });
}
