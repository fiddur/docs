import React from 'react';
import Auth0WebHeader from 'auth0-web-header';

const Header = React.createClass({
  getInitialState() {
    return {
      logged: false,
      showLock: () => {},
      showContactForm: () => {}
    };
  },

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
  },

  checkIsLogged() {
    if (!window.widget) return;

    window.widget.getClient().getSSOData(false, (err, data) => {
      const logged = !data || !data.sso;
      if (logged) return;
      this.setState({ logged });
    });
  },

  render() {
    const logged = this.state.logged;
    const showLock = this.state.showLock;
    const showContactForm = this.state.showContactForm;
    const HeaderProps = { logged, showLock, showContactForm };
    const Auth0WebHeaderProps = toAuth0WebHeaderProps(HeaderProps);

    return React.createElement(Auth0WebHeader, Auth0WebHeaderProps);
  }
});

function toAuth0WebHeaderProps(props) {
  const Auth0WebHeaderProps = {
    secondaryButtonLink: null,
    secondaryButtonOnClick: props.showContactForm,
    className: 'header--docs'
  };

  if (props.logged) {
    Auth0WebHeaderProps.primaryButtonText = 'Open Dashboard';
    Auth0WebHeaderProps.primaryButtonLink = 'https://manage.auth0.com';
  } else {
    Auth0WebHeaderProps.primaryButtonOnClick = props.showLock;
  }

  return Auth0WebHeaderProps;
}

export default Header;
