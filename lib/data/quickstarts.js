import yaml from 'js-yaml';
import fs from 'fs';
import path from 'path';

let file = path.resolve(__dirname, '../../config/quickstart.yml');
export default yaml.safeLoad(fs.readFileSync(file));
