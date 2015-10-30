import { navigateAction } from 'fluxible-router';

export default {
  customNavigationAction : function(context, payload, done) {
    var url = '/';

    if (payload.appType){
      url += `quickstart/${payload.appType}/`;

      if(payload.tech1) {
        url += `${payload.tech1}/`;
      }

      if(payload.tech2) {
        url += `${payload.tech2}`;
      }
    }

    payload.url = url;
    var routeStore = context.getStore('RouteStore');
    context.dispatch('NAVIGATE_START', payload);

    if (!routeStore.getCurrentRoute) {
       done(new Error('RouteStore has not implemented `getCurrentRoute` method.'));
       return;
    }

    var route = routeStore.getCurrentRoute();

    if (!route) {
       var error404 = {
           statusCode: 404,
           message: 'Url \'' + payload.url + '\' does not match any routes'
       };

       context.dispatch('NAVIGATE_FAILURE', error404);
       done(Object.assign(new Error(), error404));
       return;
    }

    var action = route.get('action');

    if ('string' === typeof action && context.getAction) {
       action = context.getAction(action);
    }

    if (!action || 'function' !== typeof action) {
       context.dispatch('NAVIGATE_SUCCESS', route);
       done();
       return;
    }

    context.executeAction(action, route, function (err) {
       if (err) {
           var error500 = {
               statusCode: err.statusCode || 500,
               message: err.message
           };

           context.dispatch('NAVIGATE_FAILURE', error500);
           done(Object.assign(err, error500));
       } else {
           context.dispatch('NAVIGATE_SUCCESS', route);
           done();
       }
    });
  }
}
