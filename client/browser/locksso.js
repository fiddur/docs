function getBasicInfo () {
  return {
    path: window.location.pathname,
    url: window.location.toString(),
    title: document.title,
    referrer: document.referrer,
    category: 'Lock',
    label: 'docs'
  }
}

var options = {
  auth: { redirectUrl: window.env.DOMAIN_URL_APP + '/callback' },
  theme: {
    logo: '//cdn.auth0.com/styleguide/latest/lib/logos/img/badge.png'
  },
  rememberLastLogin: true,
  integratedWindowsLogin: false,
  socialButtonStyle: 'big',
  languageDictionary: {
    signUpTerms: 'By signing up, you agree to our <a href="/terms" target="_new">terms of service</a> and <a href="/privacy" target="_new">privacy policy</a>'
  },
  configurationBaseUrl: window.env.DOMAIN_URL_CDN,
};

var widget = window.widget = new Auth0Lock(window.env.AUTH0_CLIENT_ID, window.env.AUTH0_DOMAIN, options);

widget.on('signup ready', function() {
  if (!window.metricsLib) return;
  window.metricsLib.track('open:signup', getBasicInfo());
});

widget.on('signin ready', function() {
  if (!window.metricsLib) return;
  window.metricsLib.track('open:signin', getBasicInfo());
});

window.login = function () {
  if (window.metricsLib) {
    window.metricsLib.track('click:signin', getBasicInfo());
  }
  widget.show({ initialScreen: 'login' });
};

window.signup = function() {
  if (window.metricsLib) {
    window.metricsLib.track('click:signup', getBasicInfo());
  }
  widget.show({ initialScreen: 'signUp' });
}
