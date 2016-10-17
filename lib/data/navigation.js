import yaml from 'js-yaml';
import fs from 'fs';
import path from 'path';
import _ from 'lodash';
import { docsByUrl } from '../../lib/docs/builder';


const sections = yaml.safeLoad(fs.readFileSync('./docs/config/sections.yml'));
const cards = yaml.safeLoad(fs.readFileSync('./docs/config/cards.yml'));
const sidebar = yaml.safeLoad(fs.readFileSync('./docs/config/sidebar.yml'));

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
}

fixLinks(cards);
fixLinks(sections);
fixLinks(sidebar);

export {
  cards,
  sections,
  sidebar
};
