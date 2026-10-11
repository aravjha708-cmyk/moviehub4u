/**
 * CineStatic - Main Application Logic
 * Pure Vanilla JavaScript - Zero Dependencies
 */

(function () {
  'use strict';

  // --- Mobile Navigation Drawer ---
  const mobileToggle = document.querySelector('.mobile-menu-toggle');
  const mobileDrawer = document.querySelector('.mobile-nav-drawer');

  if (mobileToggle && mobileDrawer) {
    mobileToggle.addEventListener('click', function () {
      const isOpen = mobileDrawer.classList.contains('open');
      if (isOpen) {
        mobileDrawer.classList.remove('open');
        mobileToggle.setAttribute('aria-expanded', 'false');
      } else {
        mobileDrawer.classList.add('open');
        mobileToggle.setAttribute('aria-expanded', 'true');
      }
    });

    // Close mobile menu on Escape key
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && mobileDrawer.classList.contains('open')) {
        mobileDrawer.classList.remove('open');
        mobileToggle.setAttribute('aria-expanded', 'false');
      }
    });

    // Close on click outside
    document.addEventListener('click', function (e) {
      if (mobileDrawer.classList.contains('open') && 
          !mobileDrawer.contains(e.target) && 
          !mobileToggle.contains(e.target)) {
        mobileDrawer.classList.remove('open');
        mobileToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // --- Image Fallback Handler ---
  // Ensure broken or unavailable poster links fallback cleanly to the vector default
  window.handleImageError = function (img, fallbackPath) {
    if (!img.getAttribute('data-failed')) {
      img.setAttribute('data-failed', 'true');
      img.src = fallbackPath || 'assets/images/default-poster.svg';
    }
  };

  // Attach error handler to all existing images
  document.querySelectorAll('img[data-fallback]').forEach(function (img) {
    img.addEventListener('error', function () {
      const fallback = img.getAttribute('data-fallback') || 'assets/images/default-poster.svg';
      window.handleImageError(img, fallback);
    });
  });

  // --- Copy Link / Share Toast ---
  window.showToast = function (message) {
    let toast = document.querySelector('.toast-notice');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'toast-notice';
      document.body.appendChild(toast);
    }
    toast.textContent = message || 'Link copied to clipboard!';
    toast.classList.add('show');
    clearTimeout(window._toastTimeout);
    window._toastTimeout = setTimeout(function () {
      toast.classList.remove('show');
    }, 2800);
  };

  window.copyPageUrl = function () {
    const url = window.location.href;
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(url).then(function () {
        window.showToast('Page link copied to clipboard!');
      }).catch(function () {
        prompt('Copy link:', url);
      });
    } else {
      prompt('Copy link:', url);
    }
  };

  // --- Search Trigger Shortcut (Ctrl/Cmd + K) ---
  document.addEventListener('keydown', function (e) {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      const searchInput = document.querySelector('.search-input');
      if (searchInput) {
        e.preventDefault();
        searchInput.focus();
      } else {
        const searchBtn = document.querySelector('.search-trigger-btn');
        if (searchBtn) {
          e.preventDefault();
          window.location.href = searchBtn.getAttribute('href') || 'search.html';
        }
      }
    }
  });

})();
