export default function sendMessageToParentFrame(message) {
  // Don't try to send messages to our parent frame if we're rendering on the server.
  if (typeof window === 'undefined') return;

  // Don't try to send messages if we have no parent, or we can't send them.
  if (!parent || typeof parent.postMessage !== 'function') return;

  parent.postMessage(message, window.env.DOMAIN_URL_APP);
}
