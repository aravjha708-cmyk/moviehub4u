/**
 * CineStatic - Catalog Filtering & Sorting
 * Client-Side Enhancement for movies.html
 */

(function () {
  'use strict';

  let allMovies = [];
  const gridContainer = document.getElementById('catalog-grid');
  const countDisplay = document.getElementById('catalog-count');
  const emptyState = document.getElementById('catalog-empty');
  const categoryFilter = document.getElementById('filter-category');
  const qualityFilter = document.getElementById('filter-quality');
  const languageFilter = document.getElementById('filter-language');
  const sortSelect = document.getElementById('filter-sort');
  const resetBtn = document.getElementById('reset-filters-btn');

  // Helper to construct a movie card HTML
  function renderMovieCard(movie, basePath) {
    basePath = basePath || '';
    const posterSrc = movie.poster || (basePath + 'assets/images/default-poster.svg');
    const fallbackPath = basePath + 'assets/images/default-poster.svg';
    const detailUrl = basePath + 'movies/' + encodeURIComponent(movie.slug) + '.html';
    const topQuality = movie.qualities && movie.qualities.length ? movie.qualities[movie.qualities.length - 1] : 'HD';
    const is4K = topQuality.toUpperCase().includes('4K');
    const badgeClass = is4K ? 'card-badge-top-right card-badge-4k' : 'card-badge-top-right';

    const genreText = movie.genres ? movie.genres.slice(0, 2).join(', ') : '';

    return `
      <article class="movie-card" data-id="${movie.id}">
        <a href="${detailUrl}" class="card-poster-link" aria-label="View details for ${movie.title}">
          <span class="card-badge-top-left">${movie.language || 'Multi'}</span>
          <span class="${badgeClass}">${topQuality}</span>
          ${movie.rating ? `
            <span class="card-rating-badge">
              <svg viewBox="0 0 24 24"><polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"></polygon></svg>
              ${movie.rating}
            </span>
          ` : ''}
          <img 
            src="${posterSrc}" 
            alt="${movie.title} Poster" 
            class="card-poster-img" 
            loading="lazy" 
            width="300" 
            height="450"
            onerror="window.handleImageError && window.handleImageError(this, '${fallbackPath}')"
          />
        </a>
        <div class="card-body">
          <h3 class="card-title">
            <a href="${detailUrl}">${movie.title}</a>
          </h3>
          <div class="card-meta">
            <span>${movie.releaseYear || ''}</span>
            <span>${movie.runtime || ''}</span>
          </div>
          ${genreText ? `<div class="card-genres">${genreText}</div>` : ''}
          <a href="${detailUrl}" class="card-download-btn" aria-label="Download ${movie.title}">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
            <span>Download</span>
          </a>
        </div>
      </article>
    `;
  }

  function applyFilters() {
    if (!allMovies.length) return;

    const cat = categoryFilter ? categoryFilter.value : 'all';
    const qual = qualityFilter ? qualityFilter.value : 'all';
    const lang = languageFilter ? languageFilter.value : 'all';
    const sort = sortSelect ? sortSelect.value : 'latest';

    let filtered = allMovies.filter(function (m) {
      if (cat !== 'all') {
        const hasCat = m.categories && m.categories.includes(cat);
        const hasGenre = m.genres && m.genres.map(function(g) { return g.toLowerCase(); }).includes(cat.toLowerCase());
        if (!hasCat && !hasGenre) return false;
      }
      if (qual !== 'all') {
        if (!m.qualities || !m.qualities.includes(qual)) return false;
      }
      if (lang !== 'all') {
        const matchesLang = m.language && m.language.toLowerCase() === lang.toLowerCase();
        const matchesAvail = m.languagesAvailable && m.languagesAvailable.some(function(l) { return l.toLowerCase().includes(lang.toLowerCase()); });
        if (!matchesLang && !matchesAvail) return false;
      }
      return true;
    });

    // Sorting
    filtered.sort(function (a, b) {
      if (sort === 'latest') {
        return new Date(b.publishedAt || 0) - new Date(a.publishedAt || 0);
      }
      if (sort === 'rating') {
        return (b.rating || 0) - (a.rating || 0);
      }
      if (sort === 'year') {
        return (b.releaseYear || 0) - (a.releaseYear || 0);
      }
      if (sort === 'title') {
        return a.title.localeCompare(b.title);
      }
      return 0;
    });

    if (countDisplay) {
      countDisplay.textContent = `Showing ${filtered.length} movie${filtered.length === 1 ? '' : 's'}`;
    }

    if (gridContainer) {
      if (filtered.length === 0) {
        gridContainer.innerHTML = '';
        if (emptyState) emptyState.style.display = 'block';
      } else {
        if (emptyState) emptyState.style.display = 'none';
        gridContainer.innerHTML = filtered.map(function (m) {
          return renderMovieCard(m, '');
        }).join('');
      }
    }
  }

  function initCatalog() {
    fetch('data/movies.json')
      .then(function (res) {
        if (!res.ok) throw new Error('Failed to load movie data');
        return res.json();
      })
      .then(function (data) {
        allMovies = data;

        // Check URL params for category or query
        const urlParams = new URLSearchParams(window.location.search);
        const catParam = urlParams.get('category');
        const qualParam = urlParams.get('quality');
        const langParam = urlParams.get('language');

        if (catParam && categoryFilter) categoryFilter.value = catParam;
        if (qualParam && qualityFilter) qualityFilter.value = qualParam;
        if (langParam && languageFilter) languageFilter.value = langParam;

        applyFilters();

        if (categoryFilter) categoryFilter.addEventListener('change', applyFilters);
        if (qualityFilter) qualityFilter.addEventListener('change', applyFilters);
        if (languageFilter) languageFilter.addEventListener('change', applyFilters);
        if (sortSelect) sortSelect.addEventListener('change', applyFilters);

        if (resetBtn) {
          resetBtn.addEventListener('click', function () {
            if (categoryFilter) categoryFilter.value = 'all';
            if (qualityFilter) qualityFilter.value = 'all';
            if (languageFilter) languageFilter.value = 'all';
            if (sortSelect) sortSelect.value = 'latest';
            applyFilters();
          });
        }
      })
      .catch(function (err) {
        console.error('Catalog load error:', err);
      });
  }

  if (document.getElementById('catalog-grid')) {
    initCatalog();
  }

})();
