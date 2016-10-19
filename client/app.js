import Fluxible from 'fluxible';
import TutorialStore from './stores/TutorialStore';
import ArticleStore from './stores/ArticleStore';
import serviceProxyPlugin from 'fluxible-plugin-service-proxy';
import devToolsPlugin from 'fluxible-plugin-devtools';
import Application from './components/Application';
import ApplicationStore from './stores/ApplicationStore';
import ContentStore from './stores/ContentStore';
import StaticContentStore from './stores/StaticContentStore';
import NavigationStore from './stores/NavigationStore';
import RouteStore from './stores/RouteStore';
import SearchStore from './stores/SearchStore';
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
app.registerStore(ContentStore);
app.registerStore(TutorialStore);
app.registerStore(ArticleStore);
app.registerStore(NavigationStore);
app.registerStore(SearchStore);
app.registerStore(StaticContentStore);

module.exports = app;
