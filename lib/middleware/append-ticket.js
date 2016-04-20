import { findByTicket } from '../connections';

export default function appendTicket(req, res, next) {
  res.locals.ticket = 'YOUR_TICKET';
  res.locals.connectionDomain = 'YOUR_CONNECTION_NAME';
  res.locals.connectionName = res.locals.connectionName || 'YOUR_CONNECTION_NAME';
  if (!req.query.ticket) return next();
  findByTicket(req.query.ticket, function(err, connection) {
    if (err) return res.sendStatus(500);
    if (!connection) return res.sendStatus(404);
    res.locals.ticket = req.query.ticket;
    res.locals.connectionDomain = connection.options.tenant_domain;
    res.locals.connectionName = connection.name;
    next();
  });
}
