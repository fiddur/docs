export default function loadEnvironment(context, payload, done) {
  context.dispatch('ENVIRONMENT_LOADED', {
    env: payload.env
  });
  if (done) done();
}
