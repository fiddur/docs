/* global Raven */
let LoggingService = {}


LoggingService.debug = function(msg, data) {
  console.log(msg);
  if (data) {
    console.log(data);
  }
}

LoggingService.info = function(msg, data) {
  data = data || {};
  data.level = 'info'
  Raven.captureMessage(msg, data);
}

LoggingService.warn = function(msg, data) {
  data = data || {};
  data.level = 'warning'
  Raven.captureMessage(msg, data);
}

LoggingService.error = function(msg, data) {
  data = data || {};
  data.level = 'error'
  Raven.captureMessage(msg, data);
}

export default LoggingService;
