/* global Raven */

const LoggingService = {};

LoggingService.debug = (msg, data = {}) => {
  console.log(msg);
  if (data) console.log(data);
};

LoggingService.info = (msg, data = {}) => {
  data.level = 'info';
  Raven.captureMessage(msg, data);
};

LoggingService.warn = (msg, data = {}) => {
  data.level = 'warning';
  Raven.captureMessage(msg, data);
};

LoggingService.error = (msg, data = {}) => {
  data.level = 'error';
  Raven.captureMessage(msg, data);
};

export default LoggingService;
