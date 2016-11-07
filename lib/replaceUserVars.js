const VARS = {
  __AUTH0_USERNAME__: (data) => data.account.username,
  __AUTH0_APPNAME__: (data) => data.account.appName,
  __AUTH0_TENANT__: (data) => data.account.tenant,
  __AUTH0_NAMESPACE__: (data) => data.account.namespace,
  __AUTH0_CLIENT_ID__: (data) => data.account.clientId,
  __AUTH0_CLIENT_SECRET__: (data) => data.account.clientSecret,
  __AUTH0_CALLBACK__: (data) => data.account.callback,
  __AUTH0_CONNECTION_NAME__: (data) => data.connectionName
};

/**
 * This replaces placeholders in document content with the actual values
 * for the current user. TODO: Remove this once we move authentication
 * to the client.
 */
export default function replaceUserVars(content, context) {
  let transformed = content;

  Object.keys(VARS).forEach(key => {
    const value = VARS[key](context);
    transformed = transformed.replace(new RegExp(key, 'g'), value);
  });

  return transformed;
}
