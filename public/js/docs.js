var Auth0Docs;

Auth0Docs = (function($, window, document) {
  function init() {
    stickyNav();
    navTabs();
    feedbackSender();

    $('.accordion').accordion();

    hljs.configure({
      classPrefix: ''
    });

    renderCode();

    initSearch();

    setAnchorLinks();
  }

  function navTabs() {
    $('body').on('click', '.nav-tabs a', function(e) {
      e.preventDefault();

      $(this).tab('show');
    });
  }

  function setAnchorLinks() {
    $('body').on('click', '.docs-content h3', function() {
      if($(this).attr('id')) {
        window.location.hash = $(this).attr('id');
      }
    })
  }

  function renderCode() {
    $('pre code').each(function(i, block) {
      var $snippet = $(this);

      if(!$snippet.hasClass('hljs')) {
        hljs.highlightBlock(block);
        hljs.lineNumbersBlock(block);
        $snippet.addClass('hljs');
      }
    });
  }

  function initSearch() {
    var $searchInput = $('.search-input');

    var Swiftype = window.Swiftype || {};

    Swiftype.additionalInputElements = ['#search-input-2'];

    // Install Swiftype widget
    (function(w,d,t,u,n,s,e){w['SwiftypeObject']=n;w[n]=w[n]||function(){
    (w[n].q=w[n].q||[]).push(arguments);};s=d.createElement(t);
    e=d.getElementsByTagName(t)[0];s.async=1;s.src=u;e.parentNode.insertBefore(s,e);
    })(window,document,'script','//s.swiftypecdn.com/install/v1/st.js','_st');

    // Run Swiftype widget
    _st('install','XZueLo9ygDyMKse1qg6Z');

    // Update input with current query value
    $searchInput.val(hashParams().stq || '')

    // update input at any hashchange
    // XXX: Used mostly when pushstate change of hash search
    $(window).hashchange(function() {
      $searchInput.val(hashParams().stq);
    });

    // Private helper functions
    function queryParser (a) {
      var i, p, b = {};
      if (a === "") {
        return {};
      }
      for (i = 0; i < a.length; i += 1) {
        p = a[i].split('=');
        if (p.length === 2) {
          b[p[0]] = decodeURIComponent(p[1].replace(/\+/g, " "));
        }
      }
      return b;
    };

    function hashParams () {
      return queryParser(window.location.hash.substr(1).split('&'));
    };
  }

  function feedbackSender() {
    var submitFeedback = function(positive, comment) {
      var pageTitle = document.title;
      var titleParts = document.title.split('-');
      if (titleParts.length > 0) {
        pageTitle = titleParts[0].trim();
      }
      var feedback = {
        page_title: pageTitle,
        page_url: window.location.href,
        positive: positive,
        comment: comment
      };
      $.post(window.BASE_URL + '/submit-feedback', feedback);
    };

    $('.js-feedback-sender .choose').on('click', function(e) {
      e.preventDefault();

      $('.feedback-choose').hide();

      if ($(this).hasClass('choose-yes')) {
        submitFeedback(true);
        $('.feedback-yes').show();
      } else {
        $('.feedback-no').show();
      }
    });

    $('.js-feedback-sender form').submit(function(e) {
      e.preventDefault();

      if(!$(this).find('textarea').val()) {
        return alert('Please leave a comment before submitting');
      }

      submitFeedback(false, e.target[0].value);
      $('.feedback-no').hide();
      $('.feedback-yes').show();
    });
  }

  function setWaypoints(list, offset) {
    var $module = $(list);

    $module.find('li a').each(function() {
      var id = $(this).attr('href');

      var opts = {
        handler: function(direction) {
          var pos = $(window).scrollTop();
          var prev = this.previous();

          $('.is-active', $module).removeClass('is-active');

          if(prev && direction === 'up') {
            $('a[href="#' + prev.element.id + '"]', $module).closest('li').addClass('is-active');
          } else {
            $('a[href="' + id + '"]', $module).closest('li').addClass('is-active');
          }
        },
        group: 'waypoints' + list
      };

      if(offset) {
        opts.offset = offset;
      }

      $(id).waypoint(opts);
    });
  }

  function stickyNav(refresh) {
    var navOffset = 0;

    $(window)
      .on('scroll', onScroll);

    $('body').on('click', '.js-sticky-nav a', onClickStickyNavLink);

    setWaypoints('.navigation-bar', 66);

    function onScroll() {
      var sticky = $('.js-sticky-nav').filter(':visible');

      if(sticky.length) {
        toggleSticky(sticky);
      }

      if(sticky.hasClass('sidebar-sbs')) {
        anchorSBS(sticky);
      }


    }

    function anchorSBS(sticky) {
      var stickyHeight = sticky.find('.wrapper').outerHeight();
      var stickyBottom = $(document).scrollTop() + stickyHeight;
      var cDoc = sticky.closest('.js-doc-template').find('.docs-content');
      var cDocBottom = (cDoc.offset().top + cDoc.outerHeight());

      if(!cDoc.length) {
        return;
      }

      if(stickyBottom > cDocBottom) {
        sticky.addClass('is-anchored').css({
          'height': cDoc.outerHeight()
        });
      } else {
        sticky.removeClass('is-anchored');
      }
    }

    function onClickStickyNavLink(e) {
      e.preventDefault();

      var sticky = $(this).closest('.js-sticky-nav');

      var pos = $($(this).attr('href')).offset().top;

      if(sticky.hasClass('navigation-bar')) {
        pos = Math.floor(pos - sticky.outerHeight());
      }

      scrollAnimated(pos, 400);
    }

    function toggleSticky($nav) {
      if(!$nav.hasClass('is-fixed')) {
        navOffset = $nav.offset().top;
      }

      var isFixed = $(window).scrollTop() > navOffset;

      $nav.toggleClass('is-fixed', isFixed);
    }
  }

  function scrollAnimated(to, duration) {
    var start = $(window).scrollTop(),
      change = to - start,
      currentTime = 0,
      increment = 20;

    function easeInOut(currentTime, startValue, change, duration) {
      currentTime /= duration / 2;

      if (currentTime < 1) {
        return change / 2 * currentTime * currentTime + startValue;
      }

      currentTime--;

      return -change / 2 * (currentTime * (currentTime - 2) - 1) + startValue;
    }

    function animateScroll() {
      currentTime += increment;

      var val = easeInOut(currentTime, start, change, duration);

      $(window).scrollTop(val);

      if (currentTime < duration) {
        setTimeout(animateScroll, increment);
      }
    }

    animateScroll();
  }

  return {
    init: init,
    renderCode: renderCode,
    setWaypoints: setWaypoints,
    initSearch: initSearch
  };
})(jQuery, window, document);

$(function() {
  Auth0Docs.init();
});
