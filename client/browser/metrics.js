const METHODS = [
  'segment', 'track', 'setUserId', 'identify', 'alias', 'page', 'getData', 'ready', 'traits'
];

let metricsImpl;

const metricsProxy = {
  isReady: () => metricsImpl !== undefined
};

// Build a proxy that can intercept calls to the actual metrics library
// and warn if they were made before the library was loaded.
METHODS.forEach(name => {
  metricsProxy[name] = (...args) => {
    if (metricsImpl) {
      metricsImpl[name](...args);
    } else {
      console.warn(`metrics.${name}() was called but the metrics library has not been loaded. Event was ignored.`);
    }
  };
});

// Loads the metrics library by adding a dynamic script tag to the body.
const loadMetricsLibrary = (segmentKey, dwhEndpoint) => {
  const script = document.createElement('script');
  script.type = 'text/javascript';
  script.id = 'script-auth0-metrics';
  script.async = true;
  script.src = '//cdn.auth0.com/js/m/metrics-1.min.js';

  script.onerror = () => {
    console.error('Error loading the metrics library. All events will be ignored.');
  };

  script.onload = () => {
    if (typeof Auth0Metrics === 'undefined') {
      console.error('Error loading the metrics library. Auth0Metrics is not defined.');
      return;
    }

    // Instantiate the metrics client and save it so we can call it via the proxy.
    metricsImpl = new Auth0Metrics(segmentKey, dwhEndpoint, 'docs');

    // When the metrics library is ready, call page() to register the first page view.
    metricsImpl.ready(() => metricsImpl.page());
  };

  const node = document.getElementsByTagName('script')[0];
  node.parentNode.insertBefore(script, node);
};

if (typeof window !== 'undefined') {
  const { SEGMENT_KEY, DWH_ENDPOINT } = window.env;

  if (!DWH_ENDPOINT) {
    console.warn('DWH_ENDPOINT must be defined. All metrics events will be ignored.');
  } else {
    loadMetricsLibrary(SEGMENT_KEY, DWH_ENDPOINT);
  }

  // Set the metrics proxy as a global variable so it can be accessed by
  // other client-side scripts. TODO: Can we remove this?
  window.metricsLib = metricsProxy;
}

export default metricsProxy;
