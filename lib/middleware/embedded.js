
/* eslint-disable no-param-reassign */

export default function embedded(req, res, next) {
  res.locals.embedded = false;
  res.locals.framed = false;

  if (req.query.e) {
    res.locals.embedded = true;
  }

  // Check if framed mode (Only allowed in quickstarts)
  if (req.query.framed && req.originalUrl.startsWith('/docs/quickstart')) {
    res.locals.framed = true;
  }

  next();
}
