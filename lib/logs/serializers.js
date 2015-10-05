var serializers = require('auth0-common-logging').Serializers;
var _ = require('lodash');

module.exports = _.extend({}, serializers, {
  req: function (req) {
    var result = serializers.req(req);
    //these properties are unnecesary and will be deleted soon from common-logging
    delete result.referer;
    delete result.ua;
    delete result.host;
    delete result.path;

    result.url = req.originalUrl;
    result.user = this.user(req.user);
    result.tenant = req.session && req.session.current_tenant;

    return result;
  },
  user: function (user) {
    if (!user) { return; }
    console.dir(user);
    return {
      user_id:     user.id,
      email:       user.email,
      is_owner:    user.is_owner,
      loginsCount: user.loginsCount
    };
  },
  err: function (err) {
    if (!err) { return; }
    return serializers.err(err);
  }
});