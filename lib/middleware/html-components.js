import pug from 'pug';
import path from 'path';
import React, { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import Header from '../../client/components/Header';

const webHeader = renderToString(createElement(Header, null));
const footerView = path.resolve(__dirname, '../../node_modules/auth0-styleguide/lib/footer/demo.jade');
let webFooter;

export default function htmlComponents(req, res, next) {
  // var escape = nconf.get('BASE_URL').replace(/\/([^\/]*)/ig, '/..');
  res.locals.webheader = webHeader;

  if (webFooter) {
    res.locals.webfooter = webFooter;
    next();
  } else {
    pug.renderFile(footerView, (err, html) => {
      webFooter = html;
      res.locals.webfooter = webFooter;
      next();
    });
  }
}
