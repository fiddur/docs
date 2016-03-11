import lsr from 'lsr';
import path from 'path';
import fs from 'fs';
import nconf from 'nconf';

const docsPath = nconf.get('DOCS_PATH');

var files = [];

function loadPath(loadPath) {
  var resolvedPath = path.resolve(docsPath, loadPath);
  lsr
    .sync(resolvedPath)
    .forEach(function(fileStat) {
      var filename = fileStat.path;

      if (!/\.(md|html|yml)$/.test(filename)) return;

      var filepath = path.resolve(resolvedPath, filename);
      var text = fs.readFileSync(filepath, 'utf8');
      files.push({
        filename: path.join('/', loadPath, filename),
        text: text
      });
    });
}

[
  './articles',
  './config',
  './snippets',
  './updates'
].map(loadPath);


export default files;
