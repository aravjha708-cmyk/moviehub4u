/**
 * CineStatic - Hero Movie Slider
 * Smooth, Hardware-Accelerated, Touch-Enabled Sliding for Latest Releases
 */

(function () {
  'use strict';

  function initHeroSlider() {
    const slider = document.getElementById('heroSlider');
    const track = document.getElementById('sliderTrack');
    const prevBtn = document.getElementById('sliderPrev');
    const nextBtn = document.getElementById('sliderNext');
    const pagination = document.getElementById('sliderPagination');

    if (!slider || !track) return;

    const slides = Array.from(track.querySelectorAll('.slider-slide'));
    const totalSlides = slides.length;
    if (totalSlides <= 1) return;

    const dots = pagination ? Array.from(pagination.querySelectorAll('.slider-dot')) : [];
    let currentIndex = 0;
    let autoPlayTimer = null;
    const AUTO_PLAY_DELAY = 5000;

    function updateSlider(index) {
      currentIndex = (index + totalSlides) % totalSlides;
      track.style.transform = 'translate3d(-' + (currentIndex * 100) + '%, 0, 0)';

      slides.forEach(function (slide, i) {
        if (i === currentIndex) {
          slide.classList.add('active');
          slide.setAttribute('aria-hidden', 'false');
        } else {
          slide.classList.remove('active');
          slide.setAttribute('aria-hidden', 'true');
        }
      });

      dots.forEach(function (dot, i) {
        if (i === currentIndex) {
          dot.classList.add('active');
          dot.setAttribute('aria-selected', 'true');
        } else {
          dot.classList.remove('active');
          dot.setAttribute('aria-selected', 'false');
        }
      });
    }

    function nextSlide() {
      updateSlider(currentIndex + 1);
    }

    function prevSlide() {
      updateSlider(currentIndex - 1);
    }

    function startAutoPlay() {
      stopAutoPlay();
      autoPlayTimer = setInterval(nextSlide, AUTO_PLAY_DELAY);
    }

    function stopAutoPlay() {
      if (autoPlayTimer) {
        clearInterval(autoPlayTimer);
        autoPlayTimer = null;
      }
    }

    function restartAutoPlay() {
      stopAutoPlay();
      startAutoPlay();
    }

    // Controls
    if (prevBtn) {
      prevBtn.addEventListener('click', function (e) {
        e.preventDefault();
        prevSlide();
        restartAutoPlay();
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', function (e) {
        e.preventDefault();
        nextSlide();
        restartAutoPlay();
      });
    }

    // Dot indicators
    dots.forEach(function (dot) {
      dot.addEventListener('click', function (e) {
        e.preventDefault();
        const targetIndex = parseInt(dot.getAttribute('data-slide'), 10);
        if (!isNaN(targetIndex)) {
          updateSlider(targetIndex);
          restartAutoPlay();
        }
      });
    });

    // Pause on Hover & Focus
    slider.addEventListener('mouseenter', stopAutoPlay);
    slider.addEventListener('mouseleave', startAutoPlay);
    slider.addEventListener('focusin', stopAutoPlay);
    slider.addEventListener('focusout', startAutoPlay);

    // Keyboard Navigation
    slider.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') {
        prevSlide();
        restartAutoPlay();
      } else if (e.key === 'ArrowRight') {
        nextSlide();
        restartAutoPlay();
      }
    });

    // Touch Swipe Support for Mobile & Tablets
    let startX = 0;
    let startY = 0;
    let isSwiping = false;

    track.addEventListener('touchstart', function (e) {
      if (e.touches && e.touches.length === 1) {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
        isSwiping = true;
        stopAutoPlay();
      }
    }, { passive: true });

    track.addEventListener('touchend', function (e) {
      if (!isSwiping) return;
      isSwiping = false;
      if (e.changedTouches && e.changedTouches.length === 1) {
        const diffX = startX - e.changedTouches[0].clientX;
        const diffY = startY - e.changedTouches[0].clientY;
        // Check horizontal swipe gesture (more horizontal than vertical, over 40px)
        if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 40) {
          if (diffX > 0) {
            nextSlide();
          } else {
            prevSlide();
          }
        }
      }
      startAutoPlay();
    }, { passive: true });

    // Initialize state
    updateSlider(0);
    startAutoPlay();
  }

  // Ensure DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHeroSlider);
  } else {
    initHeroSlider();
  }
})();
