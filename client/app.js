import Fluxible from 'fluxible';
import Application from './components/Application';
import ApplicationStore from './stores/ApplicationStore';
import TutorialStore from './stores/TutorialStore';
import RouteStore from './stores/RouteStore';

// create new fluxible instance
var app = new Fluxible({
    component: Application
});

// register stores
app.registerStore(RouteStore);
app.registerStore(ApplicationStore);
app.registerStore(TutorialStore);

module.exports = app;
