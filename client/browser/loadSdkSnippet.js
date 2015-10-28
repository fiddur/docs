/* global $, sdk_config */
import highlightCode from './highlightCode';

export default function loadSdkSnippet() {
  var widgetDemo = $('#widget-demo');
  if (!widgetDemo) {
    return;
  }

  function refresh (method, clientId) {
    var example_path = method + '?' + (clientId !== 'YOUR_CLIENT_ID' ? '&a=' + clientId : '') + `&callbackOnHash=${sdk_config.callbackOnHashMode}&backend=${sdk_config.backend}`;
    var iframe_url = `${window.DOMAIN_URL_DOCS}/lock-demos/${example_path}`;
    var snippet_url = `${window.DOMAIN_URL_DOCS}/lock-snippets/${example_path}`;

    widgetDemo.attr('src', iframe_url);

    $.ajax({
      url: snippet_url,
      cache: false,
      xhrFields: {
        withCredentials: true
      }
    }).done(function (data) {
      $('#widget-snippet').html(data);
      highlightCode();
    });
  }

  $('#widget-chooser').change(function (e) {
    var method = $(this).val();
    var clientId = $('#client-chooser').length === 0 ? sdk_config.clientId : ($('#client-chooser').val() || '');
    refresh(method, clientId);
  });

  $('#client-chooser').change(function (e) {
    var method = $('#widget-chooser').val();
    var clientId = $(this).val();
    refresh(method, clientId);
  });

  $('#widget-chooser').val($('#widget-chooser option:first').attr('value'));
  $('#widget-chooser').change();
}
