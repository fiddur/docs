import fspath from 'path';
import nconf from 'nconf';
import _ from 'lodash';
import winston from 'winston';
import memdocs from './memdocs';
import path from 'path';
import matter from 'gray-matter';
import yaml from 'js-yaml';
import debug from 'debug';
import { compileTemplate } from './compiler';

const debugClient = debug('docs:builder');

const articlesPath =  '/articles/';
var docsByUrl = {};
var docsByFilename = {};
var docUrls = [];

function alternativeTitle(content) {
  var regex = /\#{1}[^\n\#]+/g;
  var match = content.match(regex);

  if (match && match.length) match = match[0].slice(1).trim();

  return match || 'Document';
}

function buildDoc(file) {
  var filepath = file.filename.replace(articlesPath, '');

  var data = matter(file.text);

  var doc = {};

  doc.filename = path.normalize(filepath);

  // Combine the index.yml metadata with the doc metadata
  var indexMeta = {};
  var indexYmlPath = path.join(articlesPath, path.dirname(doc.filename), 'index.yml');
  var indexYmlDoc = memdocs.find(doc => doc.filename.indexOf(indexYmlPath) == 0);
  if (indexYmlDoc) {
    try {
      indexMeta = yaml.safeLoad(indexYmlDoc.text);
    } catch (ex) {
      throw new Error('Invalid YAML file at ' + indexYmlPath);
    }
  }

  doc.meta = _.merge(data.data || {}, indexMeta);
  var content = data.content || '';

  // Force values of true|false
  doc.meta.public = doc.meta.public !== false;
  doc.meta.sitemap = doc.meta.sitemap !== false;

  // Check if the doc is an include
  if (filepath.indexOf('_includes') > -1 || path.basename(filepath).indexOf('_') === 0) {
    doc.meta.public = false;
    doc.meta.sitemap = false;
  }

  if (!doc.meta.url) {
    doc.meta.url = '/' + doc.filename.replace(/\.[\w]+$/, '');
  }

  if (!doc.meta.title) {
    doc.meta.title = alternativeTitle(content);
  }

  var isMarkdown = /\.md$/.test(filepath);

  var template;
  try {
    template = compileTemplate(content, isMarkdown);
  } catch (ex) {
    ex.message = 'Error compiling document "' + filepath + '". ' + ex.message;
    throw ex;
  }
  doc.template = template;

  return doc;
}


memdocs.map(file => {

  if (file.filename.indexOf(articlesPath) !== 0) return;

  if (!/\.(md|html)$/.test(file.filename)) return;

  var doc = buildDoc(file);
  var url = doc.meta.url;
  docsByUrl[url] = doc;
  docsByFilename[doc.filename] = doc;

  if (doc.meta.public) {
    docUrls.push(url);
  }
});

export { docsByUrl, docsByFilename, docUrls };