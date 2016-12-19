export default function loadUser(context, payload, done) {
  const { user } = payload;
  context.dispatch('USER_LOADED', { user });
  if (done) done();
}
