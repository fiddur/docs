import React, { Component } from 'react';
import Auth0WebHeader from 'auth0-web-header';
import { isUndefined } from 'lodash';

class Header extends Component {

  componentDidMount() {
    const metricsLib = window.metricsLib;
    const isMetricsLibLoaded = metricsLib && metricsLib.$options && metricsLib.$options.segmentKey;
    const metricsScriptTag = document.getElementById('script-auth0-metrics');

    if (isMetricsLibLoaded || !metricsScriptTag) {
      this.createContactForm(metricsLib);
    } else {
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
        metricsLib.track('register:lead:pricing-contact-form', metricsData);
        metricsLib.track('sent:talk-to-sales', metricsData);
      },
      onFormFail(metricsData) {
        metricsLib.track('fail:register:lead:pricing-contact-form', metricsData);
        metricsLib.track('fail-sent:talk-to-sales', metricsData);
      }
    });
  }

  render() {
    const { currentRoute, user } = this.props;

    // TODO: Could this be keyed off something other than the URL?
    const fullWidth = currentRoute.url.indexOf('/docs/api/management/v2') !== -1;

    const props = {
      classname: 'header--docs',
      theme: 'gray',
      secondaryButtonLink: '',
      secondaryButtonOnClick: () => this.contactForm.show(),
      featuredEnable: !fullWidth
    };

    if (user) {
      props.primaryButtonText = 'Open Dashboard';
      props.primaryButtonLink = 'https://manage.auth0.com/';
    } else {
      props.primaryButtonOnClick = () => window.login();
    }

    return <Auth0WebHeader {...props} />;
  }
}

Header.propTypes = {
  currentRoute: React.PropTypes.object,
  user: React.PropTypes.object
};

export default Header;
