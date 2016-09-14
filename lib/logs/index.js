import pkg from '../../package.json';
import nconf from 'nconf';
import agent from 'auth0-instrumentation';

var env = {};
var envVars = [
  'METRICS_API_KEY',
  'METRICS_HOST',
  'STATSD_HOST',
  'METRICS_PREFIX',
  'METRICS_FLUSH_INTERVAL',
  'ERROR_REPORTER_URL',
  'NODE_ENV',
  'CONSOLE_LOG_LEVEL',
  'LOG_LEVEL',
  'AWS_ACCESS_KEY_ID',
  'AWS_ACCESS_KEY_SECRET',
  'AWS_REGION',
  'LOG_TO_SQS',
  'LOG_TO_SQS_LEVEL',
  'LOG_TO_WEB_URL',
  'LOG_TO_WEB_LEVEL',
  'LOG_TO_KINESIS',
  'AWS_KINESIS_REGION',
  'KINESIS_OBJECT_MODE',
  'LOG_TO_KINESIS_PARTITION_KEY',
  'KINESIS_TIMEOUT',
  'KINESIS_LENGTH',
  'LOG_TO_KINESIS_LEVEL',
  'LOG_TO_KINESIS_LOG_TYPE',
  'IGNORE_PROCESS_INFO',
];
for(var i=0; i<envVars.length; i++) {
  var key = envVars[i];
  env[key] = nconf.get(key);
}

agent.init(pkg, env);

export default agent;
