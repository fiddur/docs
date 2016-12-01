export default function loadModeFlags(context, payload, done) {
  const { flags } = payload;
  context.dispatch('MODE_FLAGS_LOADED', { flags });
  if (done) done();
}
