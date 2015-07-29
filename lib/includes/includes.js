import path from 'path';
import fs from 'fs';

var includes = {};

export function init(p) {
  var files = fs.readdirSync(p);
  files.forEach(function(file) {
    var content = fs.readFileSync(path.join(p, file));
    includes[path.basename(file, '.md')] = content;
  });
}

export function add(req, res, next) {
  res.locals.includes = includes;
  next();
}
