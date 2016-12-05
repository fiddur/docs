import yaml from 'js-yaml';
import fs from 'fs';
import path from 'path';

const varsFilePath = path.resolve(__dirname, '../../docs/config/vars.yml');
const vars = yaml.safeLoad(fs.readFileSync(varsFilePath));

// TODO: Not sure if we need these anymore
/* eslint-disable no-param-reassign */
export default function urlVariables(req, res, next) {
  Object.getOwnPropertyNames(vars).forEach((key) => {
    res.locals[key] = vars[key];
  });

  next();
}
