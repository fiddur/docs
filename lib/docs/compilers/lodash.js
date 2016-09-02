import lodash from 'lodash';

/**
 * Add mixins
 */
lodash.mixin({
  capitalize: function(string) {
    return string.charAt(0).toUpperCase() + string.substring(1);
  }
});

function lodashTemplate(text) {
  return lodash.template(text);
}

export default function compiler(options) {
  return lodashTemplate;
}
