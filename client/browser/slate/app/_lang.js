require('jquery');

/*
Copyright 2008-2013 Concur Technologies, Inc.

Licensed under the Apache License, Version 2.0 (the "License"); you may
not use this file except in compliance with the License. You may obtain
a copy of the License at

  http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
License for the specific language governing permissions and limitations
under the License.
*/

var languages = [];
var languagesNames = [];

function activateLanguage(language) {
  if (!language) return;
  if (language === "") return;

  $(".lang-selector a").removeClass('active');
  $(".lang-selector a[data-language-name='" + language + "']").addClass('active');

  for (var i=0; i < languages.length; i++) {
    $(".language-" + languages[i]).hide();
    $(".lang-specific." + languages[i]).hide();
  }

  $('.lang-selector .js-selected-language').text(languagesNames[languages.indexOf(language)]);
  $('.lang-selector').removeClass('open');

  $(".language-" + language).show();
  $(".lang-specific." + language).show();

  window.toc.calculateHeights();

  // scroll to the new location of the position
  if ($(window.location.hash).get(0)) {
    $(window.location.hash).get(0).scrollIntoView(true);
  }
}

// parseURL and stringifyURL are from https://github.com/sindresorhus/query-string
// MIT licensed
// https://github.com/sindresorhus/query-string/blob/7bee64c16f2da1a326579e96977b9227bf6da9e6/license
function parseURL(str) {
  if (typeof str !== 'string') {
    return {};
  }

  str = str.trim().replace(/^(\?|#|&)/, '');

  if (!str) {
    return {};
  }

  return str.split('&').reduce(function (ret, param) {
    var parts = param.replace(/\+/g, ' ').split('=');
    var key = parts[0];
    var val = parts[1];

    key = decodeURIComponent(key);
    // missing `=` should be `null`:
    // http://w3.org/TR/2012/WD-url-20120524/#collect-url-parameters
    val = val === undefined ? null : decodeURIComponent(val);

    if (!ret.hasOwnProperty(key)) {
      ret[key] = val;
    } else if (Array.isArray(ret[key])) {
      ret[key].push(val);
    } else {
      ret[key] = [ret[key], val];
    }

    return ret;
  }, {});
};

function stringifyURL(obj) {
  return obj ? Object.keys(obj).sort().map(function (key) {
    var val = obj[key];

    if (Array.isArray(val)) {
      return val.sort().map(function (val2) {
        return encodeURIComponent(key) + '=' + encodeURIComponent(val2);
      }).join('&');
    }

    return encodeURIComponent(key) + '=' + encodeURIComponent(val);
  }).join('&') : '';
};

// gets the language set in the query string
function getLanguageFromQueryString() {
  if (location.search.length >= 1) {
    var language = parseURL(location.search).language
    if (language) {
      return language;
    } else if (jQuery.inArray(location.search.substr(1), languages) != -1) {
      return location.search.substr(1);
    }
  }

  return false;
}

// returns a new query string with the new language in it
function generateNewQueryString(language) {
  var url = parseURL(location.search);
  if (url.language) {
    url.language = language;
    return stringifyURL(url);
  }
  return language;
}

// if a button is clicked, add the state to the history
function pushURL(language) {
  if (!history) { return; }
  var hash = window.location.hash;
  if (hash) {
    hash = hash.replace(/^#+/, '');
  }
  history.pushState({}, '', '?' + generateNewQueryString(language) + '#' + hash);

  // save language as next default
  localStorage.setItem("language", language);
}

function setupLanguages(l) {
  var defaultLanguage = localStorage.getItem("language");

  languages = [];
  languagesNames = [];

  l.forEach((language) => {
    languages.push(language.key);
    languagesNames.push(language.name);
  });

  var presetLanguage = getLanguageFromQueryString();
  if (presetLanguage) {
    // the language is in the URL, so use that language!
    activateLanguage(presetLanguage);

    localStorage.setItem("language", presetLanguage);
  } else if ((defaultLanguage !== null) && (jQuery.inArray(defaultLanguage, languages) != -1)) {
    // the language was the last selected one saved in localstorage, so use that language!
    activateLanguage(defaultLanguage);
  } else {
    // no language selected, so use the default
    activateLanguage(languages[0]);
  }
}

function initEvents() {
  // if we click on a language tab, activate that language
  $(function() {
    $(".lang-selector a").on("click", function() {
      var language = $(this).data("language-name");
      pushURL(language);
      activateLanguage(language);
      return false;
    });
    $('.lang-selector .lang-selector-selected').on('click', function(){
      $('.lang-selector').toggleClass('open');
    });
    window.onpopstate = function() {
      activateLanguage(getLanguageFromQueryString());
    };
  });
}

module.exports.initEvents = initEvents;
module.exports.setupLanguages = setupLanguages;
