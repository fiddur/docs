/* eslint-disable no-param-reassign */

export default function setModeFlags(req, res, next) {
  res.locals.embedded = !!req.query.e;
  res.locals.framed = false;
  res.locals.singleQuickstart = false;
  res.locals.fullWidth = false;

  if (req.originalUrl.startsWith('/docs/quickstart')) {
    res.locals.framed = !!req.query.framed;
    res.locals.singleQuickstart = !!req.query.sq;
  }

  next();
}
