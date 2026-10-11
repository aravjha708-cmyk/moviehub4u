/**
 * CineStatic - Search & Local Indexing Logic
 * Lightweight, Instant, Zero Dependencies
 */

(function () {
  'use strict';

  let allMovies = [];
  const searchInput = document.getElementById('search-input');
  const clearBtn = document.getElementById('search-clear');
  const resultsGrid = document.getElementById('search-results-grid');
  const resultsCount = document.getElementById('search-results-count');
  const emptyState = document.getElementById('search-empty');
  const qualityFilter = document.getElementById('search-quality');
  const categoryFilter = document.getElementById('search-category');
  const emptyQueryTip = document.getElementById('search-empty-tip');

  function renderMovieCard(movie) {
    const posterSrc = movie.poster || 'assets/images/default-poster.svg';
    const fallbackPath = 'assets/images/default-poster.svg';
    const detailUrl = 'movies/' + encodeURIComponent(movie.slug) + '.html';
    const topQuality = movie.qualities && movie.qualities.length ? movie.qualities[movie.qualities.length - 1] : 'HD';
    const is4K = topQuality.toUpperCase().includes('4K');
    const badgeClass = is4K ? 'badge-quality badge-quality-4k' : 'badge-quality';

    return `
      <article class="hub-card movie-card" data-id="${movie.id}">
        <a href="${detailUrl}" class="hub-card-poster" aria-label="Download ${movie.title}">
          <span class="badge-audio">${movie.language || 'Hindi'}</span>
          <span class="${badgeClass}">${topQuality}</span>
          ${movie.rating ? `
            <span class="badge-rating">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"></polygon></svg>
              ${movie.rating}
            </span>
          ` : ''}
          <img 
            src="${posterSrc}" 
            alt="${movie.title} Poster" 
            class="hub-card-img" 
            loading="lazy" 
            width="300" 
            height="450"
            onerror="window.handleImageError && window.handleImageError(this, '${fallbackPath}')"
          />
        </a>
        <div class="hub-card-caption">
          <h3 class="hub-card-title">
            <a href="${detailUrl}">${movie.title}</a>
          </h3>
          <div class="hub-card-footer">
            <span>${movie.releaseYear || ''}</span>
            <span>${movie.runtime || 'HD'}</span>
          </div>
        </div>
      </article>
    `;
  }

  function executeSearch() {
    if (!allMovies.length) return;

    const query = searchInput ? searchInput.value.trim().toLowerCase() : '';
    const selectedQual = qualityFilter ? qualityFilter.value : 'all';
    const selectedCat = categoryFilter ? categoryFilter.value : 'all';

    // Show/hide clear button
    if (clearBtn) {
      clearBtn.style.display = query.length > 0 ? 'inline-flex' : 'none';
    }

    // Update URL parameter without reload
    const url = new URL(window.location.href);
    if (query) {
      url.searchParams.set('q', query);
    } else {
      url.searchParams.delete('q');
    }
    window.history.replaceState({}, '', url.toString());

    if (!query && selectedQual === 'all' && selectedCat === 'all') {
      if (emptyQueryTip) emptyQueryTip.style.display = 'block';
      if (emptyState) emptyState.style.display = 'none';
      if (resultsCount) resultsCount.textContent = 'Explore our full library below';
      if (resultsGrid) {
        resultsGrid.innerHTML = allMovies.map(renderMovieCard).join('');
      }
      return;
    }

    if (emptyQueryTip) emptyQueryTip.style.display = 'none';

    const matches = allMovies.filter(function (movie) {
      // Quality filter
      if (selectedQual !== 'all') {
        if (!movie.qualities || !movie.qualities.includes(selectedQual)) return false;
      }
      // Category filter
      if (selectedCat !== 'all') {
        const hasCat = movie.categories && movie.categories.includes(selectedCat);
        const hasGenre = movie.genres && movie.genres.some(function(g) { return g.toLowerCase() === selectedCat.toLowerCase(); });
        if (!hasCat && !hasGenre) return false;
      }

      // Query filter
      if (!query) return true;

      const titleMatch = movie.title && movie.title.toLowerCase().includes(query);
      const origMatch = movie.originalTitle && movie.originalTitle.toLowerCase().includes(query);
      const yearMatch = movie.releaseYear && movie.releaseYear.toString().includes(query);
      const directorMatch = movie.director && movie.director.toLowerCase().includes(query);
      const castMatch = movie.cast && movie.cast.some(function (c) { return c.toLowerCase().includes(query); });
      const genreMatch = movie.genres && movie.genres.some(function (g) { return g.toLowerCase().includes(query); });
      const langMatch = movie.language && movie.language.toLowerCase().includes(query);
      const tagMatch = movie.tags && movie.tags.some(function (t) { return t.toLowerCase().includes(query); });

      return titleMatch || origMatch || yearMatch || directorMatch || castMatch || genreMatch || langMatch || tagMatch;
    });

    if (resultsCount) {
      resultsCount.textContent = `Found ${matches.length} result${matches.length === 1 ? '' : 's'}${query ? ` for "${query}"` : ''}`;
    }

    if (resultsGrid) {
      if (matches.length === 0) {
        resultsGrid.innerHTML = '';
        if (emptyState) emptyState.style.display = 'block';
      } else {
        if (emptyState) emptyState.style.display = 'none';
        resultsGrid.innerHTML = matches.map(renderMovieCard).join('');
      }
    }
  }

  function initSearch() {
    fetch('data/movies.json')
      .then(function (res) {
        if (!res.ok) throw new Error('Failed to load movie data');
        return res.json();
      })
      .then(function (data) {
        allMovies = data;

        // Parse initial URL query
        const urlParams = new URLSearchParams(window.location.search);
        const initialQuery = urlParams.get('q');
        const initialCat = urlParams.get('category');
        const initialQual = urlParams.get('quality');

        if (initialQuery && searchInput) {
          searchInput.value = initialQuery;
        }
        if (initialCat && categoryFilter) {
          categoryFilter.value = initialCat;
        }
        if (initialQual && qualityFilter) {
          qualityFilter.value = initialQual;
        }

        executeSearch();

        // Event listeners
        let debounceTimer;
        if (searchInput) {
          searchInput.addEventListener('input', function () {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(executeSearch, 150);
          });
        }

        if (clearBtn) {
          clearBtn.addEventListener('click', function () {
            if (searchInput) {
              searchInput.value = '';
              searchInput.focus();
            }
            executeSearch();
          });
        }

        if (qualityFilter) qualityFilter.addEventListener('change', executeSearch);
        if (categoryFilter) categoryFilter.addEventListener('change', executeSearch);
      })
      .catch(function (err) {
        console.error('Search error:', err);
      });
  }

  if (document.getElementById('search-input')) {
    initSearch();
  }

})();
