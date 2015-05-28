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



exports.warningBlock = function (context) {

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
  };

};


function is_parsing_a_table () {
  var err = new Error();
  return ~err.stack.indexOf('at Object.tables.tr');
}

function is_parsing_an_include () {
  var err = new Error();
  return ~err.stack.indexOf('response.locals.include');
}

function is_parsing_warning_block () {
  var err = new Error();
  return ~err.stack.split('\n').splice(3).join('\n').indexOf('extensions.js');
}

exports.relativePath = function (context) {

  return function relativePathCompiler(converter) {
    return [{
      type: 'output',
      filter: function(text) {
        if (is_parsing_a_table() || is_parsing_an_include() || is_parsing_warning_block()) {
          return text;
        }
        //        // Jose witchery to detect if this extension is being run twice appending /docs/docs
        // var err = new Error('here!');
        // if (text.indexOf('api/v1#!#get--api-users')) {
        //   console.log('-----------');
        //   console.log(err.stack);
        //   console.log('^^^^^^^^');
        //   console.log(text);
        //   console.log('-----------');
        // }
        // if (text._relative_compiled) {
        //   return text;
        // }
        return text.replace(/href="\//g, 'href="' + nconf.get('BASE_URL') + '/');
      }
    }];
  };

};

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
