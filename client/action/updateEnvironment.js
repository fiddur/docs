export default function updateEnvironment(context, payload, done) {
  context.dispatch('ENVIRONMENT_UPDATED', {
    env: payload.env
  });
  if (done) done();
}
