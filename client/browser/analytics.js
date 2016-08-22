var metricsLib = window.metricsLib = window.metricsLib || [];
// A list of the methods in metrics.js to stub.
metricsLib.methods = [
  'segment',
  'track',
  'setUserId',
  'identify',
  'alias',
  'page',
  'getData',
  'ready',
  'traits'
];
metricsLib.factory = function(method) {
  return function() {
    var args = Array.prototype.slice.call(arguments);
    args.unshift(method);
    metricsLib.push(args);
    return metricsLib;
  };
};
for (var i = 0; i < metricsLib.methods.length; i++) {
  var key = metricsLib.methods[i];
  metricsLib[key] = metricsLib.factory(key);
}
metricsLib.load = function(segmentKey, dwhEndpoint) {
  if (null != window.Auth0Metrics) {
    metricsLib = window.metricsLib = new Auth0Metrics(segmentKey, dwhEndpoint, 'docs');
  }
  else {
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.async = true;
    script.src = ('https:' === document.location.protocol
      ? 'https://' : 'http://')
      + 'cdn.auth0.com/js/m/metrics-1.min.js';
    script.onerror = function() {
      console.error('No metrics');
    }
    script.onload = function() {
      // Grab analytics and make it private
      metricsLib = window.metricsLib = new Auth0Metrics(segmentKey, dwhEndpoint, 'docs');
    }
    var first = document.getElementsByTagName('script')[0];
    first.parentNode.insertBefore(script, first);
  }
};

if (window.env.DWH_ENDPOINT) {
  metricsLib.load(window.env.SEGMENT_KEY, window.env.DWH_ENDPOINT);
  metricsLib.page();
}
else {
  console.warn('DWH_ENDPOINT must be defined for tracking to work.')
}
