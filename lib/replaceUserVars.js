const VARS = {
  '[AUTH0_USERNAME]': (data) => data.account.username,
  '[AUTH0_APPNAME]': (data) => data.account.appName,
  '[AUTH0_TENANT]': (data) => data.account.tenant,
  '[AUTH0_NAMESPACE]': (data) => data.account.namespace,
  '[AUTH0_CLIENT_ID]': (data) => data.account.clientId,
  '[AUTH0_CLIENT_SECRET]': (data) => data.account.clientSecret,
  '[AUTH0_CALLBACK]': (data) => data.account.callback,
  '[AUTH0_CONNECTION_NAME]': (data) => data.connectionName
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
    transformed = transformed.replace(key, value);
  });

  return transformed;
}
