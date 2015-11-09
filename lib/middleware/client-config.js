import serialize from 'serialize-javascript';

export default function clientConfig(req, res, next) {

  // These are values that are made availible on the client
  // to be used in scripts. Be careful with placing new data here.
  var config = {
    sdkSnippet: {
      backend: res.locals.configuration.backend,
    },
    account: {
      clientId: res.locals.account.clientId
    }
  };

  res.locals.CLIENT_CONFIG = 'window.CONFIG=' + serialize(config);
  next();
}
