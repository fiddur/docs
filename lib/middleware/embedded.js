export default function embedded(req, res, next) {
  res.locals.embedded = false;

  if (req.query.e) {
    res.locals.embedded = true;
  }

  next();
}
