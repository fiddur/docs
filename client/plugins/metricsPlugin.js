import metrics from '../browser/metrics';

const trackEvent = (event, data) => (
  new Promise((resolve, reject) => {
    setTimeout(() => {
      metrics.track(event, data, err => {
        if (err) reject(err);
        else resolve();
      });
    }, 0);
  })
);

const trackPage = () => (
  new Promise((resolve, reject) => {
    setTimeout(() => {
      metrics.page(err => {
        if (err) reject(err);
        else resolve();
      });
    }, 0);
  })
);

export default function createMetricsPlugin() {
  return {
    name: 'MetricsPlugin',
    plugContext: (options, context, app) => ({
      plugComponentContext: (componentContext) => {
        componentContext.trackEvent = trackEvent;
        componentContext.trackPage = trackPage;
      },
      plugActionContext: (actionContext) => {
        actionContext.trackEvent = trackEvent;
        actionContext.trackPage = trackPage;
      },
      dehydrate: () => {},
      rehydrate: (state) => null
    })
  };
}
