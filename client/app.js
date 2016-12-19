import Fluxible from 'fluxible';
import serviceProxyPlugin from 'fluxible-plugin-service-proxy';
import devToolsPlugin from 'fluxible-plugin-devtools';
import Application from './components/Application';
import ApplicationStore from './stores/ApplicationStore';
import DocumentStore from './stores/DocumentStore';
import NavigationStore from './stores/NavigationStore';
import QuickstartStore from './stores/QuickstartStore';
import RouteStore from './stores/RouteStore';
import SearchStore from './stores/SearchStore';
import StaticContentStore from './stores/StaticContentStore';
import UserStore from './stores/UserStore';
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
app.registerStore(NavigationStore);
app.registerStore(QuickstartStore);
app.registerStore(SearchStore);
app.registerStore(StaticContentStore);
app.registerStore(UserStore);

module.exports = app;
