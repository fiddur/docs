import { logger } from '../../lib/logs';

export default function(req, res) {

  let LoggingService = {}


  LoggingService.debug = function(msg, data) {
    logger.debug(msg, data);
  }

  LoggingService.info = function(msg, data) {
    logger.info(msg, data);
  }

  LoggingService.warn = function(msg, data) {
    logger.warn(msg, data);
  }

  LoggingService.error = function(msg, data) {
    logger.error(msg, data);
  }

  return LoggingService;
}
