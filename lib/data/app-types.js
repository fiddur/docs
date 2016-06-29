import yaml from 'js-yaml';
import fs from 'fs';
import path from 'path';

let file = path.resolve(__dirname, '../../config/app-types.yml');
export default yaml.safeLoad(fs.readFileSync(file)).appTypes;
