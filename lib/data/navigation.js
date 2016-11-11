import yaml from 'js-yaml';
import fs from 'fs';
import { isArray, isObject, isString } from 'lodash';

function load(filename) {
  return fixLinks(yaml.safeLoad(fs.readFileSync(filename)));
}

function fixLinks(obj) {
  if (Array.isArray(obj)) {
    obj.forEach(fixLinks);
  } else {
    for (const key in obj) {
      const val = obj[key];
      if (Array.isArray(val)) {
        val.forEach(fixLinks);
      } else if (typeof val === 'object') {
        fixLinks(val);
      } else if (key === 'url' && val.indexOf('/') === 0) {
        obj[key] = `/docs${val}`;
      }
    }
  }
  return obj;
}

export default {
  cards: load('./docs/config/cards.yml'),
  sections: load('./docs/config/sections.yml'),
  sidebar: load('./docs/config/sidebar.yml')
};
