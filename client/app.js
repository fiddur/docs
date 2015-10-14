import Fluxible from 'fluxible';
import Application from './components/Application';
import ApplicationStore from './stores/ApplicationStore';
import TutorialStore from './stores/TutorialStore';
import RouteStore from './stores/RouteStore';
import fetchrPlugin from 'fluxible-plugin-fetchr';



// create new fluxible instance
var app = new Fluxible({
    component: Application
});

// register plugins
let fetchrPluginInstance = fetchrPlugin({
    xhrPath: process.env.BASE_URL + '/meta2' // Path for XHR to be served from
});

app.plug(fetchrPluginInstance);

// register stores
app.registerStore(RouteStore);
app.registerStore(ApplicationStore);
app.registerStore(TutorialStore);

module.exports = app;
