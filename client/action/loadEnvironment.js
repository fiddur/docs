export default function loadEnvironment(context, payload, done) {
  context.dispatch('ENVIRONMENT_LOADED', {
    env: payload.env,
    user: payload.user
  });
  if (done) done();
}
