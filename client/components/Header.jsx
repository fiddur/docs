import React, { Component } from 'react';
import Auth0WebHeader from 'auth0-web-header';
import { isUndefined } from 'lodash';

class Header extends Component {
  constructor(props) {
    super(props);

    this.state = {
      logged: false,
      fullWidth: false,
      showLock: () => {},
      showContactForm: () => {}
    };

    this.checkIsLogged = this.checkIsLogged.bind(this);
    this.checkIsFullWidth = this.checkIsFullWidth.bind(this);
  }

  componentDidMount() {
    const metricsLib = window.metricsLib;
    const isMetricsLibLoaded = metricsLib && metricsLib.$options && metricsLib.$options.segmentKey;

    if (isMetricsLibLoaded) {
      this.createContactForm();
    } else {
      const metricsScript = document.getElementById('script-auth0-metrics');
      if (metricsScript) {
        const metricsScriptOnload = metricsScript.onload;
        metricsScript.onload = () => {
          metricsScriptOnload();
          this.createContactForm();
        };
      } else {
        this.createContactForm();
      }
    }

    this.checkIsFullWidth();

    this.checkIsLogged();
    this.setState({ showLock: window.login });
  }

  createContactForm() {
    const jQuery = window.jQuery;
    // eslint-disable-next-line global-require
    const ContactForm = require('auth0-contact-form').default.ContactForm;

    const metricsLib = window.metricsLib;

    const contactFormOptions = {
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
    };
    const contactForm = new ContactForm(contactFormOptions);

    this.setState({
      showContactForm: () => {
        contactForm.show();
      }
    });
  }

  checkIsLogged() {
    if (isUndefined(window.widget)) return;

    window.widget.getClient().getSSOData(false, (err, data) => {
      if (err || isUndefined(data)) return;
      const logged = data.sso;
      this.setState({ logged });
    });
  }

  checkIsFullWidth() {
    const fullWidthRoutes = [
      '/docs/api/management/v2',
      '/docs/api/management/v2/'
    ];

    if (fullWidthRoutes.indexOf(window.location.pathname) > -1) {
      this.setState({ fullWidth: true });
    }
  }

  render() {
    const { logged, showLock, showContactForm, fullWidth } = this.state;

    return logged
      ? (
      <Auth0WebHeader
        className="header--docs"
        theme="gray"
        secondaryButtonLink=""
        secondaryButtonOnClick={showContactForm}
        primaryButtonText="Open Dashboard"
        primaryButtonLink="https://manage.auth0.com"
        featuredEnable={!fullWidth}
      />
      ) : (
      <Auth0WebHeader
        className="header--docs"
        theme="gray"
        secondaryButtonLink=""
        secondaryButtonOnClick={showContactForm}
        primaryButtonOnClick={showLock}
        featuredEnable={!fullWidth}
      />
      );
  }
}

export default Header;
