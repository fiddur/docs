import Fluxible from 'fluxible';
import Application from './components/Application';
import ApplicationStore from './stores/ApplicationStore';
import TutorialStore from './stores/TutorialStore';
import TutorialArticleStore from './stores/TutorialArticleStore';
import RouteStore from './stores/RouteStore';
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
app.registerStore(TutorialArticleStore);

module.exports = app;
