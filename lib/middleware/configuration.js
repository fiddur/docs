/**
 * Parse `configuration` local from `query` parameters
 *
 * @param {Request} req
 * @param {Response} res
 * @param {Function} next
 * @api public
 */

export default function (req, res, next) {
  // used by lodash extension
  var configuration = res.locals.configuration = res.locals.configuration || {};

  // common data
  configuration.frontend = req.query.frontend || null;
  configuration.api = req.query.api || null;
  configuration.backend = req.query.backend || null;
  configuration.mobile = req.query.mobile || null;
  // combination data
  configuration.thirdParty = req.query['3rd'] || req.query.thirdparty || req.query.thirdpParty || false;
  configuration.hybrid = req.query.hybrid || false;
  next();
}
