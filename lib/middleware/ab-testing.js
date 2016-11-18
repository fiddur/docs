import { logger } from '../logs';
import nconf from 'nconf';
import request from 'request';
import retry from 'retry';

const experimentsEndpoint = nconf.get('AB_EXPERIMENTS_ENDPOINT');
const cacheLifespan = 1000 * 60 * 60 * 3; // 3hs
const requestTimeout = 1000 * 2; // 2 seconds
const startRetryTimeout = 1000 * 5; // 5 seconds

let cache;
let pollTimer;
let retryBackOff = false;

function doFetch (callback) {
  logger.info('Purging experiments cache');
  cache = null;

  logger.info('Fetching experiments from server');

  let requestOptions = {
    uri: experimentsEndpoint,
    timeout: requestTimeout
  };

  request.get(requestOptions, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      logger.info('Experiments fetched. Executing callback');

      try {
        JSON.parse(body);
      } catch (e) {
        logger.error('Server did not return a valid JSON.\n Received payload:\n%s', body);
        return callback && callback();
      }

      cache = body;
      poll();

      return callback && callback();
    }

    cache = null;

    if (error) {
      logger.error('A/B Experiments fetch failed.\nError: %s', error.message);
    }

    if (response && response.statusCode !== 200) {
      logger.error('A/B Experiments fetch failed.\nResponse Status: %s\nResponse Body:\n%s', response.statusCode, response.body);
    }

    return callback && callback();
  });
}

function poll () {
  clearTimeout(pollTimer);
  pollTimer = setTimeout(doFetch, cacheLifespan);
}

/* eslint-disable no-param-reassign */

export default function fetchABExperiments (req, res, next) {
  logger.info('Loading Experiments');

  if (!experimentsEndpoint) {
    logger.warn('Experiments endpoint is not defined.');
    res.locals.abExperiments = null;
    return next();
  }

  if (cache) {
    logger.info('Returning cached experiments.');
    res.locals.abExperiments = cache;
    return next();
  }

  // Don't fetch the experiments if there is already a retry policy in progress
  if (retryBackOff) {
    logger.warn('Retrying in progress. Skipping experiments fetch.');
    res.locals.abExperiments = null;
    return next();
  }

  // We need to differentiate the first time we fetch the experiments (which is part of the request pipeline)
  // from subsequents fetchs which are going to happend as part of the retry policy.
  var firstExecution = true;

  var operation = retry.operation({ minTimeout: startRetryTimeout });

  operation.attempt(function (attemptNumber) {
    doFetch(function () {
      res.locals.abExperiments = cache;

      // Got the experiments, return
      if (cache) {
        if (firstExecution) {
          firstExecution = false;
          return next();
        }

        return;
      }

      retryBackOff = true;

      logger.warn('Experiment fetch failed. Attempt: #%s.', attemptNumber);

      if (!operation.retry(true)) {
        logger.warn('Maximum retry attempts reached. Resetting.');
        retryBackOff = false;
      }

      if (firstExecution) {
        firstExecution = false;
        return next();
      }
    });
  });


}
