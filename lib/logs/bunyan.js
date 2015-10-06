var bunyan             = require('bunyan');
var pkg                = require('../../package');
var HttpWritableStream = require('auth0-common-logging').Streams.HttpWritableStream;
var KinesisWritable    = require('aws-kinesis-writable');
var nconf = require('nconf');

var proc = {
  app:     pkg.name,
  version: pkg.version,
  node:    process.version
};

var bunyan_streams = [{
  level: nconf.get('CONSOLE_LOG_LEVEL'),
  stream: process.stdout
}];

if (nconf.get('LOG_TO_SQS')) {
  var bunyanSqs = require('bunyan-sqs');

  bunyan_streams.push({
    level: nconf.get('LOG_TO_SQS_LEVEL'),
    stream: bunyanSqs.createStream({
      accessKeyId:     nconf.get('AWS_ACCESS_KEY_ID'),
      secretAccessKey: nconf.get('AWS_ACCESS_KEY_SECRET'),
      region:          nconf.get('AWS_REGION'),
      queueName:       nconf.get('LOG_TO_SQS'),
    })
  });
}

if(nconf.get('NODE_ENV') === 'production' && nconf.get('LOG_TO_WEB_URL')){
  bunyan_streams.push({
    stream: new HttpWritableStream(nconf.get('LOG_TO_WEB_URL')),
    level: nconf.get('LOG_TO_WEB_LEVEL')
  });
}

if (nconf.get('LOG_TO_KINESIS')) {
  var stream = new KinesisWritable({
    accessKeyId:     nconf.get('AWS_ACCESS_KEY_ID'),
    secretAccessKey: nconf.get('AWS_ACCESS_KEY_SECRET'),
    streamName:      nconf.get('LOG_TO_KINESIS'),
    region:          nconf.get('AWS_KINESIS_REGION') || nconf.get('AWS_REGION'),
    partitionKey:    'auth0-server',
    buffer: {
      timeout: 5,
      length: 10,
      isPrioritaryMsg: function (msg) {
        var log_entry = JSON.parse(msg.toString());
        return log_entry.level >= 40;
      }
    }
  });

  stream.on('error', function (err) {
    logger.error({ err: err }, 'Error sending log entry to kinesis.');
  });

  bunyan_streams.push({
    stream: stream,
    level: nconf.get('LOG_TO_KINESIS_LEVEL')
  });
}

var logger = module.exports = bunyan.createLogger({
  name: pkg.name,
  process: nconf.get('NODE_ENV') === 'production' && proc.version !== '0.0.1' ? proc : undefined,
  streams: bunyan_streams,
  serializers: require('./serializers')
});
