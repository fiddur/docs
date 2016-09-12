import yaml from 'js-yaml';
import fs from 'fs';
import path from 'path';
import platforms from '../collections/platforms';
import { docsByUrl } from '../../lib/docs/builder';
import _ from 'lodash';

let sections = yaml.safeLoad(fs.readFileSync('./config/sections.yml'));
let cards = yaml.safeLoad(fs.readFileSync('./config/cards.yml'));
let sidebar = yaml.safeLoad(fs.readFileSync('./config/sidebar.yml'));

function fixLinks(obj) {
  if (Array.isArray(obj)) {
    obj.forEach(fixLinks);
  } else {
    for (var key in obj) {
      var val = obj[key];
      if (Array.isArray(val)) {
        val.forEach(fixLinks);
      } else if (typeof val === 'object') {
        fixLinks(val);
      } else if (key === 'url' && val.indexOf('/') === 0) {
        obj[key] = '/docs' + val;
      }
    }
  }
}

fixLinks(cards);
fixLinks(sections);
fixLinks(sidebar);

let metadata = _.fromPairs(_.map(docsByUrl, (doc, url) => {
  return ['/docs' + url, {
    title: doc.meta.title,
    description: doc.meta.description,
    section: doc.meta.section,
    editUrl: 'https://github.com/auth0/docs/edit/master/articles/' + doc.filename
  }]
}));

let navigation = {
  cards,
  sections,
  sidebar,
  metadata,
  platforms
};

export default navigation;
