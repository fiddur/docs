var Auth0Docs;

Auth0Docs = (function($, window, document) {
  function init() {
    stickyNav();
    submitFeedback();
    chooseFeedback();

    $('.accordion').accordion();
    hljs.initHighlightingOnLoad();
    hljs.initLineNumbersOnLoad();
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

    
    $(window).on('scroll', function() {
      var sticky = $('.js-sticky-nav').filter(':visible');

      if(sticky.length) {
        toggleSticky(sticky);
        updateNav(sticky);
      }
    });

    $('body').on('click', '.js-sticky-nav a', function(e) {
      e.preventDefault();

      var sticky = $(this).closest('.js-sticky-nav');
      var pos = $($(this).attr('href')).offset().top - sticky.outerHeight();

      scrollAnimated(pos, 400);
    });

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
    init: init
  }
})(jQuery, window, document);

$(function() {
  Auth0Docs.init();
});