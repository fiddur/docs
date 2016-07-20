import jade from 'jade';
import fs from 'fs';
import nconf from 'nconf';
import getWidgetScriptUrl from './widget-script-url';



const LOCK_10_URL = nconf.get('LOCK_10_URL');

function compileTemplate(tmplPath) {
  var tmpl = jade.compile(fs.readFileSync(tmplPath).toString(), {
    filename: tmplPath,
    pretty: process.env.NODE_ENV !== 'production' || true
  });
  return tmpl;
}

const indexTmpl = compileTemplate(__dirname + '/index.jade');
const browserTmpl = compileTemplate(__dirname + '/browser.jade');

function getTemplate(tmpl, locals) {
  var jadelocals = { callbackOnHashMode: false };
  jadelocals.widget_url = LOCK_10_URL;
  jadelocals.widget_client_id = locals.account.clientId || nconf.get('WIDGET_FALLBACK_CLIENTID');
  jadelocals.loaded_on_dashboard = locals.configuration ? locals.configuration.internal : false;
  jadelocals.widget_backend = locals.configuration ? locals.configuration.backend : null;

  Object.keys(locals).forEach(function (k) {
    jadelocals[k] = locals[k];
  });

  jadelocals.DOMAIN_URL_DOCS = nconf.get('DOMAIN_URL_DOCS');

  return tmpl(jadelocals);
  //locals.lockSDKWithCallbackOnHash = tmpl(_.extend(jadelocals, { callbackOnHashMode: true }));
}

export function lockSDKTemplate(locals) {
  return getTemplate(indexTmpl, locals);
}
export function lockBrowserTemplate(locals) {
  return getTemplate(browserTmpl, locals);
}
