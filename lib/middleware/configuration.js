/**
 * Parse `configuration` local from `query` parameters
 *
 * @param {Request} req
 * @param {Response} res
 * @param {Function} next
 * @api public
 */

export default function configuration(req, res, next) {
  // used by lodash extension
  var config = res.locals.configuration = res.locals.configuration || {};

  // common data
  config.frontend = req.query.frontend || null;
  config.api = req.query.api || null;
  config.backend = req.query.backend || null;
  config.mobile = req.query.mobile || null;
  // combination data
  config.thirdParty = req.query['3rd'] || req.query.thirdparty || req.query.thirdpParty || false;
  config.hybrid = req.query.hybrid || false;
  setImmediate(next);
}
