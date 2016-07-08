export default function loadEnvironment(context, payload) {
  return context.dispatch('ENVIRONMENT_LOADED', {
    env: payload.env
  });
}
