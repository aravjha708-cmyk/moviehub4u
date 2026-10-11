/**
 * MoviesHouse4u - Multi-Card Horizontal Hero Carousel
 * Smooth, Proper Card-Sized Multiple Cards Scrolling in Line
 */

(function () {
  'use strict';

  function initHeroCarousel() {
    const track = document.getElementById('heroTrack');
    if (!track) return;

    const prevBtns = [
      document.getElementById('heroPrevBtn'),
      document.getElementById('floatPrevBtn')
    ].filter(Boolean);

    const nextBtns = [
      document.getElementById('heroNextBtn'),
      document.getElementById('floatNextBtn')
    ].filter(Boolean);

    function getScrollDistance() {
      // Scroll by 70% of visible container width
      return Math.max(track.clientWidth * 0.72, 220);
    }

    function scrollNext() {
      const maxScroll = track.scrollWidth - track.clientWidth;
      if (track.scrollLeft >= maxScroll - 15) {
        track.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        track.scrollBy({ left: getScrollDistance(), behavior: 'smooth' });
      }
    }

    function scrollPrev() {
      if (track.scrollLeft <= 15) {
        track.scrollTo({ left: track.scrollWidth - track.clientWidth, behavior: 'smooth' });
      } else {
        track.scrollBy({ left: -getScrollDistance(), behavior: 'smooth' });
      }
    }

    let autoScrollTimer = null;
    const AUTO_DELAY = 4500;

    function startAutoScroll() {
      stopAutoScroll();
      autoScrollTimer = setInterval(scrollNext, AUTO_DELAY);
    }

    function stopAutoScroll() {
      if (autoScrollTimer) {
        clearInterval(autoScrollTimer);
        autoScrollTimer = null;
      }
    }

    // Attach click handlers
    prevBtns.forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        scrollPrev();
        stopAutoScroll();
        startAutoScroll();
      });
    });

    nextBtns.forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        scrollNext();
        stopAutoScroll();
        startAutoScroll();
      });
    });

    // Pause auto-scroll on user interaction
    track.addEventListener('mouseenter', stopAutoScroll);
    track.addEventListener('mouseleave', startAutoScroll);
    track.addEventListener('touchstart', stopAutoScroll, { passive: true });
    track.addEventListener('touchend', startAutoScroll, { passive: true });
    track.addEventListener('focusin', stopAutoScroll);
    track.addEventListener('focusout', startAutoScroll);

    // Keyboard navigation when track is focused
    track.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') {
        scrollNext();
        stopAutoScroll();
      } else if (e.key === 'ArrowLeft') {
        scrollPrev();
        stopAutoScroll();
      }
    });

    startAutoScroll();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHeroCarousel);
  } else {
    initHeroCarousel();
  }
})();
