import Fluxible from 'fluxible';
import { loadSettingsAction } from 'auth0-tutorial-navigator';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import NavigationStore from './stores/NavigationStore';
import SideBarNav from './components/SideNavBar';
import { createElementWithContext } from 'fluxible-addons-react';


const app = new Fluxible({
  component: SideBarNav
});
app.registerStore(NavigationStore);

export default function sidebar(req, res, next) {

  const context = app.createContext();
  context.executeAction(loadSettingsAction, {
    quickstart: res.locals.quickstart,
    navigation: res.locals.navigation
  }).then(() => {
    const element = createElementWithContext(context);
    const markup = ReactDOMServer.renderToStaticMarkup(element);
    res.locals.sidebar = markup;
    next();
  }).catch(next);
}
