import memdocs from '../docs/memdocs';
import _ from 'lodash';
import fs from 'fs'
import path from 'path';
import yaml from 'js-yaml';
import d from 'debug';

/**
 * This builds the list of platforms that are available for each app type (eg. native or web).
 * Starting with the articlePath variable set for each app type in quickstart.yml, we search all
 * of the loaded documents to find index.yml files that describe each platform. The final exported
 * value is the list of platforms grouped by app type, sorted alphabetically by name.
 */

let debug = d('docs:platforms');
let {appTypes} = yaml.safeLoad(fs.readFileSync(path.resolve(__dirname, '../../config/quickstart.yml')));

let platformsByAppType = {};
appTypes.forEach(appType => {
  
  let platforms = platformsByAppType[appType.name] = [];
  debug("finding platforms for %s", appType.name);
  
  memdocs.forEach(file => {
    // We're looking for the index.yml file that describes the platform.
    if (file.filename.indexOf(appType.path) !== 0 || !/index\.yml$/.test(file.filename)) return;
    
    let name = file.filename.substr(appType.path.length + 1, file.filename.lastIndexOf('/'));
    let platform = yaml.safeLoad(file.text);
    platform.type = appType.name;
    
    debug("adding platform %s: %s", platform.name, file.filename);
    platforms.push(platform);
  });
  
  platforms.sort((a, b) => a.name.toUpperCase() - b.name.toUpperCase());
  
});

export default platformsByAppType;
