/* global $ */

export default function loadSdkSnippet(options) {
  var refresh = function(method, clientId) {
    var example_path = method + '?' + (clientId && clientId !== 'YOUR_CLIENT_ID' ? 'a=' + clientId : '') + `&callbackOnHash=${options.callbackOnHashMode}&backend=${options.backend}`;
    var iframe_url = `/docs/lock-demos/${example_path}`;
    var snippet_url = `/docs/lock-snippets/${example_path}`;

    $('#widget-demo').attr('src', iframe_url);

    $.ajax({
      url: snippet_url,
      cache: false,
      xhrFields: {
        withCredentials: true
      }
    }).done(function (data) {
      $('#widget-snippet').html(data);
      window.highlightCode();
    });
  };

  $('#widget-chooser').change(function (e) {
    var method = $(this).val();
    var clientId = $('#client-chooser').length === 0 ? options.clientId : ($('#client-chooser').val() || '');
    refresh(method, clientId);
  });

  $('#client-chooser').change(function (e) {
    var method = $('#widget-chooser').val();
    var clientId = $(this).val();
    refresh(method, clientId);
  });

  var widgetChooser = document.getElementById('widget-chooser');
  if (widgetChooser) {
    $(widgetChooser).val($('#widget-chooser option:first').attr('value'));
    $(widgetChooser).change();
  } else {
    refresh('login', options.clientId);
  }

}
