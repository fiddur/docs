const METHODS = [
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

// Create stub functions for each of the public methods of the metrics library.
// This allows the rest of the site to call into the metrics library without checking to make sure it is ready.
let stubs = {};
METHODS.forEach(function(name) {
  stubs[name] = function() {
    console.warn(`metrics.${name}() was called but the metrics library has not been loaded. Event was ignored.`);
  };
});

// Temporarily expose the stub library as the public interface to metrics.
window.metricsLib = stubs;

if (!window.env.DWH_ENDPOINT) {
  console.warn('DWH_ENDPOINT must be defined. All metrics events will be ignored.')
}
else {

  // Create a dynamic script element that will load the actual metrics library.
  let script = document.createElement('script');
  script.type = 'text/javascript';
  script.id = 'script-auth0-metrics';
  script.async = true;
  script.src = '//cdn.auth0.com/js/m/metrics-1.min.js';

  script.onerror = function() {
    console.error('There was an error loading the metrics library. All events will be ignored.');
  };

  script.onload = function() {

    // Replace the stub library with the real one.
    let metrics = window.metricsLib = new Auth0Metrics(window.env.SEGMENT_KEY, window.env.DWH_ENDPOINT, 'docs');

    // When the metrics library is ready, call page() to register the first page view.
    metrics.ready(function() {
      metrics.page();
    });

  };

  var node = document.getElementsByTagName('script')[0];
  node.parentNode.insertBefore(script, node);

}
