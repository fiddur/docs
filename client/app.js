import Fluxible from 'fluxible';
import Application from './components/Application';
import ApplicationStore from './stores/ApplicationStore';
import { TutorialStore, ArticleStore } from 'auth0-tutorial-navigator';
import NavigationStore from './stores/NavigationStore';
import RouteStore from './stores/RouteStore';
import UserStore from './stores/UserStore';
import serviceProxyPlugin from 'fluxible-plugin-service-proxy';


// create new fluxible instance
var app = new Fluxible({
  component: Application
});

// register plugins
app.plug(serviceProxyPlugin());

// register stores
app.registerStore(RouteStore);
app.registerStore(ApplicationStore);
app.registerStore(TutorialStore);
app.registerStore(ArticleStore);
app.registerStore(NavigationStore);
app.registerStore(UserStore);

module.exports = app;
