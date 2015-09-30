import _ from 'lodash';
import prepareImage from './image_formatter'

function prepareLandingPages(landings) {
  _.forEach(landings, function(landing) {
    if (landing.banner.module) {
      prepareModule(landing.banner.module);
    }

    prepareModule(landing.banner);

    landing.modules.forEach(prepareModule);
  });

  return landings;
}

function prepareModule(module) {
  if (module.image) {
    module.image = prepareImage(module.image);
  }

  if (module.icon) {
    module.icon = prepareImage(module.icon);
  }
}

export default prepareLandingPages;
