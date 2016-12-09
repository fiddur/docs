import loadUser from '../action/loadUser';

const loadUserDataFromManagementApp = (message) => {
  const { user, client } = message;

  const translatedUser = {
    account: {
      userName: user.name,
      appName: client.name && client.name.trim !== '' ? client.name : 'Your App',
      tenant: user.tenant,
      namespace: client.namespace,
      clientId: client.id,
      clientSecret: client.secret,
      callback: client.callbacks[0] || 'https://YOUR_APP/callback'
    },
    // The management site will never send the connection name, so we just keep it as the default.
    connectionName: 'YOUR_CONNECTION_NAME'
  };

  const context = window.context;
  context.executeAction(loadUser, { user: translatedUser });
};

const parentOrigin = window.env.DOMAIN_URL_APP;

window.addEventListener('message', (event) => {
  const origin = event.origin || event.originalEvent.origin;
  if (origin !== parentOrigin) return;

  const message = event.data;
  if (message.type === 'userData') {
    loadUserDataFromManagementApp(message);
  }
});
