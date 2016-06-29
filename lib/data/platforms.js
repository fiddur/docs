import memdocs from '../docs/memdocs';
import Doc from '../docs/doc';
import _ from 'lodash';
import yaml from 'js-yaml';
import d from 'debug';
import appTypes from './app-types';

let debug = d('docs:platforms');

/**
 * This builds the list of platforms that are available for all app types.
 *
 * Starting with the articlePath variable set for each app type in quickstart.yml, we search all
 * of the loaded documents to find index.yml files that describe each platform. The final exported
 * value is the list of platforms, grouped by app name, with each list sorted alphabetically by name.
 */

let platformsByAppType = {};
appTypes.forEach(appType => {

  let platforms = platformsByAppType[appType.name] = [];

  // Gather all of the docs for this appType.
  let path = '/articles/' + appType.slug;
  let docs = memdocs.filter(doc => doc.filename.indexOf(path) == 0);

  // Find the index.yml files that describe each platform.
  let indexes = docs.filter(doc => /index\.yml$/.test(doc.filename));

  indexes.forEach(doc => {
    let tokens = doc.filename.split('/');
    let meta = yaml.safeLoad(doc.text);
    let platform = _.clone(meta);

    platform.name = tokens[tokens.length - 2];
    platform.type = appType.name;
    platform.description = meta.description;
    platform.url = `/docs/quickstart/${platform.type}/${platform.name}`;

    if (!meta.articles) {
      throw new Error(`The YAML file at ${doc.filename} is invalid: Missing articles list.`);
    }

    platform.articles = meta.articles.map((name, index) => {
      let filename = tokens.slice(0, tokens.length - 1).concat([name + '.md']).join('/');
      let article = docs.find(d => d.filename == filename);
      if (article) {
        let doc = new Doc(article.filename, article.text).getMeta();
        return {
          name,
          number: index + 1,
          title: doc.title,
          description: doc.description,
          url: platform.url + '/' + name
        };
      }
      else {
        throw new Error(`Couldn't find article ${name} for platform ${platform.name}`);
      }
    });

    platforms.push(platform);
  });

  platforms.sort((a, b) => a.name.toUpperCase() - b.name.toUpperCase());

});

export default platformsByAppType;
