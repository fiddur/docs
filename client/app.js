import Fluxible from 'fluxible';
import Application from './components/Application';
import ApplicationStore from './stores/ApplicationStore';
import DocumentStore from './stores/DocumentStore';
import { TutorialStore, ArticleStore } from 'auth0-tutorial-navigator';
import NavigationStore from './stores/NavigationStore';
import RouteStore from './stores/RouteStore';
import UserStore from './stores/UserStore';
import serviceProxyPlugin from 'fluxible-plugin-service-proxy';
import devToolsPlugin from 'fluxible-plugin-devtools';
import metricsPlugin from './plugins/metricsPlugin';

// create new fluxible instance
var app = new Fluxible({
  component: Application
});

// register plugins
app.plug(serviceProxyPlugin());
app.plug(metricsPlugin());
app.plug(devToolsPlugin());

// register stores
app.registerStore(RouteStore);
app.registerStore(ApplicationStore);
app.registerStore(DocumentStore);
app.registerStore(TutorialStore);
app.registerStore(ArticleStore);
app.registerStore(NavigationStore);
app.registerStore(UserStore);

module.exports = app;
