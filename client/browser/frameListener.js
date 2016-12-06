const updateUserData = (message) => {
  window.user = message.user;
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
