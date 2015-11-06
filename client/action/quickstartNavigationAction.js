import { navigateAction } from 'fluxible-router';

export default {
  quickstartNavigationAction : function(context, payload, done) {
    var url = (payload.baseUrl || '') +  '/';

    if (payload.appType){
      url += `quickstart/${payload.appType}/`;

      if(payload.tech1) {
        url += `${payload.tech1}/`;
      }

      if(payload.tech2) {
        url += `${payload.tech2}`;
      }
    }

    return navigateAction(context, { url : url }, done)
  }
}
