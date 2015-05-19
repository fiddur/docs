/**
 * Module dependencies.
 */

var lodash = require('lodash');
var nconf = require('nconf');

/**
* Add mixins
*/
lodash.mixin({
  capitalize : function(string) {
    return string.charAt(0).toUpperCase() + string.substring(1);
  }
});

/**
 * Expose extensions
 */

exports.lodash = lodashExtension;

/**
 * Lodash Pre-compile extension
 *
 * @param {Object} context
 * @return {Function} Showdown extension
 * @api public
 */

function lodashExtension(context) {
  // Ugly ugly ugly!
  // But it's how showdown works...
  return function lodashCompiler(converter) {
    return [{
      type: 'lang',
      filter: function (text) {
        return context.meta.lodash
          ? lodash.template(text)(context)
          : text;
      }
    }];
  }
}



exports.warningBlock = warningBlockExtension;


function warningBlockExtension(context) {

  return function warningBlockCompiler(converter) {
    return [{
      type: 'lang',
      filter: function(text) {
        return text.replace(/\^\^warning\ (.*)/, function(wholeMatch, m1) {
          var result = '<blockquote class="warning">';
          result += converter.makeHtml(m1);
          result += '</blockquote>';
          return result;
        });
      }
    }];
  }

}

exports.relativePath = relativePathExtension;

function relativePathExtension(context) {

  return function relativePathCompiler(converter) {
    return [{
      type: 'output',
      filter: function(text) {
        return text.replace(/href="\//g, 'href="' + nconf.get('BASE_URL') + '/');
      }
    }]
  }

}

exports.mediaPath = mediaPathExtension;

function mediaPathExtension(context) {

  return function mediaPathCompiler(converter) {
    return [{
      type: 'output',
      filter: function(text) {
        return text.replace(/src="\/media\//g, 'src="' + nconf.get('MEDIA_URL') + '/');
      }
    }]
  }

}
