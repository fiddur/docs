import React, { Component } from 'react';
import Auth0WebHeader from 'auth0-web-header';

class Header extends Component {
  constructor(props) {
    super(props);

    this.state = {
      logged: false,
      showLock: () => {},
      showContactForm: () => {}
    };

    this.checkIsLogged = this.checkIsLogged.bind(this);
  }

  componentDidMount() {
    const jQuery = window.jQuery;
    const metricsLib = window.metricsLib;
    const ContactForm = require('auth0-contact-form').default.ContactForm;
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

    // Lock instance is created under Application component
    setTimeout(() => {
      this.checkIsLogged();
      this.setState({ showLock: window.login });
    }, 50);
  }

  checkIsLogged() {
    if (!window.widget) return;

    window.widget.getClient().getSSOData(false, (err, data) => {
      const logged = !data || !data.sso;
      if (logged) return;
      this.setState({ logged });
    });
  }

  render() {
    const { logged, showLock, showContactForm } = this.state;

    return logged
      ? <Auth0WebHeader
          className="header--docs"
          theme="gray"
          secondaryButtonOnClick={showContactForm}
          primaryButtonText="Open Dashboard"
          primaryButtonLink="https://manage.auth0.com"
        />
      : <Auth0WebHeader
          className="header--docs"
          theme="gray"
          secondaryButtonOnClick={showContactForm}
          secondaryButtonLink=""
          primaryButtonOnClick={showLock}
        />;
  }
}

export default Header;
