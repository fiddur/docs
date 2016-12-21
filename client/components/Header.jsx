import React, { Component } from 'react';
import Auth0WebHeader from 'auth0-web-header';
import { isUndefined } from 'lodash';

class Header extends Component {

  componentDidMount() {
    const metricsLib = window.metricsLib;
    const isMetricsLibLoaded = metricsLib && metricsLib.$options && metricsLib.$options.segmentKey;
    const metricsScriptTag = document.getElementById('script-auth0-metrics');

    // Always init the contact form.
    // Doesn't matter if the metrics lib is loaded or not.
    this.createContactForm(metricsLib);

    // Only if the metrics lib isn't loaded, attach an event to create a new version
    // of the contact form with metrics.
    if (!isMetricsLibLoaded && metricsScriptTag) {
      const metricsScriptOnload = metricsScriptTag.onload;
      metricsScriptTag.onload = () => {
        metricsScriptOnload();
        this.createContactForm(metricsLib);
      };
    }
  }

  createContactForm(metricsLib) {
    // eslint-disable-next-line global-require, import/newline-after-import
    const { ContactForm } = require('auth0-contact-form').default;
    this.contactForm = new ContactForm({
      onModalOpen() {
        metricsLib.track('open:talk-to-sales');
      },
      onFormSuccess(metricsData) {
        metricsLib.track('register:lead:talk-to-sales-modal', metricsData);
        metricsLib.track('sent:talk-to-sales', metricsData);
      },
      onFormFail(metricsData) {
        metricsLib.track('fail:register:lead:talk-to-sales-modal', metricsData);
        metricsLib.track('fail-sent:talk-to-sales', metricsData);
      }
    });
  }

  render() {
    const { currentRoute, isAuthenticated } = this.props;

    const props = {
      className: this.props.fullWidth ? 'header-full-width' : '',
      theme: this.props.theme,
      talkToSalesButtonLink: '',
      talkToSalesButtonOnClick: () => this.contactForm.show(),
      featuredEnable: !this.props.fullWidth
    };

    if (isAuthenticated) {
      props.loginButtonEnable = false;
      props.signupButtonText = 'Open Dashboard';
      props.signupButtonLink = 'https://manage.auth0.com/';
    } else {
      props.loginButtonEnable = true;
      props.loginButtonOnClick = () => window.login();
      props.signupButtonOnClick = () => window.signup();
    }

    return <Auth0WebHeader {...props} />;
  }
}

Header.propTypes = {
  theme: React.PropTypes.string,
  currentRoute: React.PropTypes.object,
  isAuthenticated: React.PropTypes.bool,
  fullWidth: React.PropTypes.bool
};

export default Header;
