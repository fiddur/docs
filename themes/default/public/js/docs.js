var Auth0Docs;

Auth0Docs = (function($, window, document) {
  function init() {
    stickyNav();
    submitFeedback();
    chooseFeedback();
    tabs();

    $('.accordion').accordion();

    hljs.configure({
      classPrefix: ''
    });

    renderCode();
  }

  function tabs() {
    $('body').on('click', '.nav-tabs a', function(e) {
      e.preventDefault();
      
      $(this).tab('show');
    });
  }

  function throttle(callback, limit) {
    var wait = false; 
    return function() { 
      if (!wait) {
        callback.call();
        wait = true;
        setTimeout(function() {
          wait = false;
        }, limit);
      }
    }
  }

  function debounce(func, threshold, execAsap) {
    var timeout;

    return function debounced() {
      var obj = this,
        args = arguments;

      function delayed() {
        if (!execAsap) func.apply(obj, args);
        timeout = null;
      };

      if(timeout) {
        clearTimeout(timeout);
      } else if(execAsap) {
        unc.apply(obj, args);
      }

      timeout = setTimeout(delayed, threshold || 100);
    };
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

  function buildStepNav($template) {
    var $list = $template.find('.sidebar-sbs ul');

    if(!$list.length) {
      return;
    }

    function getList() {
      var $collection = $('<ul>');

      $template.find('.nav-tabs a').off('shown.bs.tab');
      $template.find('.nav-tabs a').on('shown.bs.tab', function(e) {
        buildStepNav($template);
      });

      $template.find('.tab-pane.active h3').each(function() {
        var href = $(this).attr('id');
        var str = $(this).text().split('.');
        var text;

        str.shift();
        text = str.join('.').trim();
        
        $collection.append('<li><a href="#' + href + '">' + text + '</a></li>')
      });

      return $collection;
    }

    $list.replaceWith(getList());
  }

  function chooseFeedback() {
    $('.choose').on('click', function(e) {
      e.preventDefault();

      $('.feedback-choose').hide();

      if ($(this).hasClass('choose-yes')) {
        $('.feedback-yes').show();
      } else {
        $('.feedback-no').show();
      }
    });
  }

  function submitFeedback() {
    $('.send-feedback').submit(function(e) {
      e.preventDefault();
      e.stopPropagation();

      $('.feedback-no').hide();
      $('.feedback-yes').show();
    });
  }

  function stickyNav(refresh) {
    var navOffset = 0;

    $(window)
      .on('scroll', throttle(onScrollThrottle, 200))
      .on('scroll', onScroll)

    $('body').on('click', '.js-sticky-nav a', onClickStickyNavLink);

    function onScrollThrottle() {
      var sticky = $('.js-sticky-nav').filter(':visible');

      if(sticky.length) {
        updateNav(sticky);
      }
    }

    function onScroll() {
      var sticky = $('.js-sticky-nav').filter(':visible');

      if(sticky.length) {
        toggleSticky(sticky);
      }
    }

    function onClickStickyNavLink(e) {
      e.preventDefault();

      var sticky = $(this).closest('.js-sticky-nav');

      var pos = $($(this).attr('href')).offset().top;

      if(sticky.hasClass('navigation-bar')) {
        pos = (pos - sticky.outerHeight()) + 5;
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

    function updateNav($nav) {
      function getScroll() {
        var scrollPos = $(window).scrollTop();
        var stickyNav = $nav;

        if (stickyNav.hasClass('is-fixed')) {
          scrollPos = scrollPos + stickyNav.outerHeight() + 40;
        }

        return scrollPos;
      }

      function getActiveLink() {
        if($nav.find('.is-active').length) {
          return $nav.find('.is-active')
        }

        return $nav.find('li:first')
      }

      var $activeLink = getActiveLink(),
          $activeSection = $($activeLink.find('a').attr('href'));

      if($activeSection.length) {
        var activeSectionPos = $activeSection.offset().top,
            activeSectionBottom = activeSectionPos + $activeSection.outerHeight();

        var $nextLink = getLink('next');
        var $prevLink = getLink('prev');

        if (getScroll() >= activeSectionPos) {
          setActiveSection($activeLink);
        } else {
          $activeLink.removeClass('is-active');
        }

        if ($nextLink.length) {
          var $nextSection = $($nextLink.find('a').attr('href')),
              nextSectionPos = $nextSection.offset().top,
              nextSectionBottom = nextSectionPos + $nextSection.outerHeight();

          if (getScroll() >= nextSectionPos) {
            setActiveSection($nextLink);
          }
        }

        if ($prevLink.length) {
          var $prevSection = $($prevLink.find('a').attr('href')),
              prevSectionPos = $prevLink.offset().top,
              prevSectionBottom = prevSectionPos + $prevSection.outerHeight(),
              backThreshold = 100;

          if (getScroll() < activeSectionPos - backThreshold) {
            setActiveSection($prevLink);
          }
        }

        function setActiveSection($selected) {
          $nav.find('.is-active').removeClass('is-active');
          $selected.addClass('is-active');
        }

        function getLink(direction) {
          var next = $activeLink.next(),
              prev = $activeLink.prev();

          if(direction === 'next') {
            if(next.length) {
              return next;
            }
          }

          if(direction === 'prev') {
            if(prev.length) {
              return prev;
            }
          }

          return [];
        }

      }
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
    buildStepNav: buildStepNav
  }
})(jQuery, window, document);

$(function() {
  Auth0Docs.init();
});