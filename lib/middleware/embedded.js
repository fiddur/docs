export default function embedded(req, res, next) {
  res.locals.embedded = false;
  res.locals.framed = false;
  res.locals.include_metadata = false;

  if (req.query.e || req.query.callback) {
    res.locals.embedded = true;
  } else if (req.query.framed) {
    res.locals.framed = true;
  }

  if (req.query.m) {
    res.locals.include_metadata = true;
  }

  if (req.query.callback) {
    res.locals.jsonp = true;
  } else if (!req.accepts('html') && req.accepts('application/json')) {
    res.locals.json = true;
  }

  next();
}