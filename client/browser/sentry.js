if (window.env.SENTRY_DSN) {
  Raven.config(window.env.SENTRY_DSN).install();
}
