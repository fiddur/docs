import memdocs from '../docs/memdocs';
import _ from 'lodash';
import fs from 'fs'
import path from 'path';
import yaml from 'js-yaml';
import d from 'debug';

/**
 * This builds the list of platforms that are available for all app types.
 * 
 * Starting with the articlePath variable set for each app type in quickstart.yml, we search all
 * of the loaded documents to find index.yml files that describe each platform. The final exported
 * value is the list of platforms, grouped by app name, with each list sorted alphabetically by name.
 */

let debug = d('docs:platforms');
let {appTypes} = yaml.safeLoad(fs.readFileSync(path.resolve(__dirname, '../../config/quickstart.yml')));

let platformsByAppType = {};
appTypes.forEach(appType => {
  
  let platforms = platformsByAppType[appType.name] = [];
  
  memdocs.forEach(file => {
    // We're looking for the index.yml file that describes the platform.
    if (file.filename.indexOf(appType.path) !== 0 || !/index\.yml$/.test(file.filename)) return;
    
    let tokens = file.filename.split('/');
    let name = tokens[tokens.length - 2];
    let platform = yaml.safeLoad(file.text);
    
    platform.name = name;
    platform.type = appType.name;
    
    platforms.push(platform);
  });
  
  platforms.sort((a, b) => a.name.toUpperCase() - b.name.toUpperCase());
  
});

export default platformsByAppType;
