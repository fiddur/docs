function initMouseflow(mouseflowId) {
  if (!mouseflowId) return;
  var _mfq = _mfq || [];
  (function() {
    var mf = document.createElement("script");
    mf.type = 'text/javascript'; mf.async = true;
    mf.src = `//cdn.mouseflow.com/projects/#{mouseflowId}.js`;
    document.getElementsByTagName("head")[0].appendChild(mf);
  })();
  window.initMouseflow = function initMouseflow() {
    window._mfq = window._mfq || [];
    if (window.metricsLib && window.metricsLib.dwh) {
      window._mfq.push(['setVariable', 'ANON_ID', window.metricsLib.dwh.anonymousId()]);        
    }
  };
}

function initSegment(mouseflowId, segmentKey, dwhEndpoint) {
  if (!segmentKey) return;
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
      if (mouseflowId) {
        metricsLib.ready(window.initMouseflow);
      }
    }
    else {
      var script = document.createElement('script');
      script.type = 'text/javascript';
      script.async = true;
      script.src = ('https:' === document.location.protocol
        ? 'https://' : 'http://')
        + 'cdn.auth0.com/js/m/metrics-1.min.js';
      script.onerror = function() {
        console.error("No metrics");
      }
      script.onload = function() {
        // Grab analytics and make it private
        metricsLib = window.metricsLib = new Auth0Metrics(segmentKey, dwhEndpoint, 'docs');
      }
      var first = document.getElementsByTagName('script')[0];
      first.parentNode.insertBefore(script, first);
    }
  };

  if (dwhEndpoint) {
    metricsLib.load(segmentKey, dwhEndpoint);
    metricsLib.page();
  }
  else {
    console.error("DWH_ENDPOINT must be defined for tracking to work.")
  }
}

export default function analytics(mouseflowId, segmentKey, dwhEndpoint) {
  initMouseflow(mouseflowId);
  initSegment(mouseflowId, segmentKey, dwhEndpoint);
};
