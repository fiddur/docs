import { logger } from '../../lib/logs';

const LoggingService = {};

LoggingService.debug = (msg, data) => {
  logger.debug(msg, data);
};

LoggingService.info = (msg, data) => {
  logger.info(msg, data);
};

LoggingService.warn = (msg, data) => {
  logger.warn(msg, data);
};

LoggingService.error = (msg, data) => {
  logger.error(msg, data);
};

export default LoggingService;
