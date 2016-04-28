function getMetrics() {
  if (typeof window !== 'undefined') {
    return window.metricsLib;
  }
}

function trackEvent(event, data) {
  return new Promise((resolve, reject) => {
    var metrics = getMetrics();
    if (metrics) {
      metrics.track(event, data, function (err) {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    } else {
      resolve();
    }
  });
}

function trackPage() {
  return new Promise((resolve, reject) => {
    var metrics = getMetrics();
    if (metrics) {
      metrics.page(function (err) {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    } else {
      resolve();
    }
  });
}

export default function () {
  return {
    // Required unique name property
    name: 'MetricsPlugin',

    /**
     * Called after context creation to dynamically create a context plugin
     * @method plugContext
     * @param {Object} options Options passed into createContext
     * @param {Object} context FluxibleContext instance
     * @param {Object} app Fluxible instance
     */
    plugContext: function (options, context, app) {
      // Returns a context plugin
      return {
        /**
         * Method called to allow modification of the component context
         * @method plugComponentContext
         * @param {Object} componentContext Options passed into createContext
         * @param {Object} context FluxibleContext instance
         * @param {Object} app Fluxible instance
         */
        plugComponentContext: function (componentContext, context, app) {
          componentContext.trackEvent = trackEvent;
          componentContext.trackPage = trackPage;
        },

        /**
         * Method called to allow modification of the action context
         * @method plugActionContext
         * @param {Object} actionContext Options passed into createContext
         * @param {Object} context FluxibleContext instance
         * @param {Object} app Fluxible instance
         */
        plugActionContext: function (actionContext, context, app) {
          actionContext.trackEvent = trackEvent;
          actionContext.trackPage = trackPage;
        },


        dehydrate: function() {return {};},
        rehydrate: function(state) {return null;}
      }
    }
  }
}
