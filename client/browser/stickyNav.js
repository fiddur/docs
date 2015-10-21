/* global $ */

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

export default function stickyNav(refresh) {
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
