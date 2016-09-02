export default function embedded(req, res, next) {
  res.locals.amp = false;

  if (req.query.amp === '1') {
    res.locals.amp = true;
  }

  next();
}
