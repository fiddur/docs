$(function() {
  var sticky = $('.js-sticky-nav');

  $(window).on('scroll', function() {
    if(sticky.length) {
      toggleSticky(sticky);
      updateNav(sticky);
    }
  });

  sticky.on('click', 'a', function(e) {
    e.preventDefault();

    var pos = $($(this).attr('href')).offset().top - sticky.outerHeight();

    scrollAnimated(pos, 400);
  });

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

  function toggleSticky($nav) {
    if(!$nav.hasClass('is-fixed')) {
      navOffset = $nav.offset().top;
    }
    if ($(window).scrollTop() > navOffset) {
      $nav.addClass('is-fixed');
    } else {
      $nav.removeClass('is-fixed');
    }
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
});