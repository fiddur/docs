import React, { Component } from 'react';
import Auth0WebHeader from 'auth0-web-header';

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
    
    this.checkIsFullWidth();

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
  
  checkIsFullWidth() {
    let fullWidthRoutes = [
      '/docs/api/management/v2',
      '/docs/api/management/v2/'
    ];
    
    if (fullWidthRoutes.indexOf(window.location.pathname) > -1) {
      return this.setState({ fullWidth: true });
    }
  }

  render() {
    const { logged, showLock, showContactForm, fullWidth } = this.state;

    return logged
      ? <Auth0WebHeader
          className="header--docs"
          theme="gray"
          secondaryButtonOnClick={showContactForm}
          primaryButtonText="Open Dashboard"
          primaryButtonLink="https://manage.auth0.com"
          featuredEnable={!fullWidth}
        />
      : <Auth0WebHeader
          className="header--docs"
          theme="gray"
          secondaryButtonOnClick={showContactForm}
          secondaryButtonLink=""
          primaryButtonOnClick={showLock}
          featuredEnable={!fullWidth}
        />;
  }
}

export default Header;
