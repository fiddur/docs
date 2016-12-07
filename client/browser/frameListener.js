import loadUser from '../action/loadUser';

const updateUserData = (message) => {
  const { user } = message;
  const context = window.context;
  context.executeAction(loadUser, { user });
};

const parentOrigin = window.env.DOMAIN_URL_APP;

window.addEventListener('message', (event) => {
  const origin = event.origin || event.originalEvent.origin;
  if (origin !== parentOrigin) return;

  const message = event.data;
  if (message.type === 'userData') {
    updateUserData(message);
  }
});
