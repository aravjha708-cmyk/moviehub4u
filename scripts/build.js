/**
 * CineStatic - Static Site Generator
 * Generates pre-rendered HTML for all movie pages, category pages, index.html, movies.html, and sitemap.xml.
 * Pure Node.js Standard Library - No external npm dependencies.
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const MOVIES_PATH = path.join(ROOT_DIR, 'data', 'movies.json');
const CATEGORIES_PATH = path.join(ROOT_DIR, 'data', 'categories.json');
const MOVIES_OUT_DIR = path.join(ROOT_DIR, 'movies');
const CATEGORY_OUT_DIR = path.join(ROOT_DIR, 'category');

// Ensure output directories exist
if (!fs.existsSync(MOVIES_OUT_DIR)) fs.mkdirSync(MOVIES_OUT_DIR, { recursive: true });
if (!fs.existsSync(CATEGORY_OUT_DIR)) fs.mkdirSync(CATEGORY_OUT_DIR, { recursive: true });

// Read data
const rawMovies = fs.readFileSync(MOVIES_PATH, 'utf-8');
const rawCategories = fs.readFileSync(CATEGORIES_PATH, 'utf-8');
const movies = JSON.parse(rawMovies);
const categories = JSON.parse(rawCategories);

// Helper for escaping HTML text
function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// Reusable Navigation Header HTML
function getHeaderHtml(activeTab, depth) {
  const prefix = depth === 1 ? '../' : '';
  return `
  <header class="site-header" role="banner">
    <div class="container header-inner">
      <a href="${prefix}index.html" class="brand" aria-label="CineStatic Home">
        <img src="${prefix}assets/images/logo.svg" alt="CineStatic Logo" class="brand-logo" width="160" height="32" />
      </a>

      <nav class="nav-desktop" aria-label="Primary Navigation">
        <a href="${prefix}index.html" class="nav-link ${activeTab === 'home' ? 'active' : ''}">Home</a>
        <a href="${prefix}movies.html" class="nav-link ${activeTab === 'movies' ? 'active' : ''}">All Movies</a>
        <a href="${prefix}category/south-indian.html" class="nav-link ${activeTab === 'south-indian' ? 'active' : ''}">South Indian</a>
        <a href="${prefix}category/hindi-dubbed.html" class="nav-link ${activeTab === 'hindi-dubbed' ? 'active' : ''}">Hindi Dubbed</a>
        <a href="${prefix}category/action.html" class="nav-link ${activeTab === 'action' ? 'active' : ''}">Action</a>
        <a href="${prefix}category/bollywood.html" class="nav-link ${activeTab === 'bollywood' ? 'active' : ''}">Bollywood</a>
        <a href="${prefix}category/hollywood.html" class="nav-link ${activeTab === 'hollywood' ? 'active' : ''}">Hollywood</a>
      </nav>

      <div class="header-actions">
        <a href="${prefix}search.html" class="search-trigger-btn" aria-label="Search movies">
          <svg viewBox="0 0 24 24" fill="none" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <span>Search</span>
        </a>
        <button class="mobile-menu-toggle" aria-label="Open Mobile Menu" aria-expanded="false">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>
      </div>
    </div>
  </header>

  <!-- Mobile Drawer -->
  <div class="mobile-nav-drawer" role="dialog" aria-label="Mobile Navigation">
    <a href="${prefix}index.html" class="nav-link ${activeTab === 'home' ? 'active' : ''}">Home</a>
    <a href="${prefix}movies.html" class="nav-link ${activeTab === 'movies' ? 'active' : ''}">All Movies</a>
    <a href="${prefix}search.html" class="nav-link ${activeTab === 'search' ? 'active' : ''}">Search & Filters</a>
    <a href="${prefix}category/south-indian.html" class="nav-link ${activeTab === 'south-indian' ? 'active' : ''}">South Indian</a>
    <a href="${prefix}category/hindi-dubbed.html" class="nav-link ${activeTab === 'hindi-dubbed' ? 'active' : ''}">Hindi Dubbed</a>
    <a href="${prefix}category/action.html" class="nav-link ${activeTab === 'action' ? 'active' : ''}">Action</a>
    <a href="${prefix}category/bollywood.html" class="nav-link ${activeTab === 'bollywood' ? 'active' : ''}">Bollywood</a>
    <a href="${prefix}category/hollywood.html" class="nav-link ${activeTab === 'hollywood' ? 'active' : ''}">Hollywood</a>
  </div>
`;
}

// Reusable Footer HTML
function getFooterHtml(depth) {
  const prefix = depth === 1 ? '../' : '';
  const year = new Date().getFullYear();
  return `
  <footer class="site-footer" role="contentinfo">
    <div class="container">
      <div class="footer-top">
        <div class="footer-brand">
          <a href="${prefix}index.html">
            <img src="${prefix}assets/images/logo.svg" alt="CineStatic Logo" width="150" height="30" />
          </a>
          <p>
            CineStatic is an ultra-fast, lightweight movie discovery portal providing verified multi-audio downloads, real screenshots, and comprehensive film details.
          </p>
        </div>
        <div>
          <h4 class="footer-heading">Categories</h4>
          <ul class="footer-links">
            <li><a href="${prefix}category/south-indian.html">South Indian</a></li>
            <li><a href="${prefix}category/hindi-dubbed.html">Hindi Dubbed</a></li>
            <li><a href="${prefix}category/bollywood.html">Bollywood</a></li>
            <li><a href="${prefix}category/hollywood.html">Hollywood</a></li>
            <li><a href="${prefix}category/web-series.html">Web Series</a></li>
          </ul>
        </div>
        <div>
          <h4 class="footer-heading">Genres</h4>
          <ul class="footer-links">
            <li><a href="${prefix}category/action.html">Action</a></li>
            <li><a href="${prefix}category/thriller.html">Thriller</a></li>
            <li><a href="${prefix}category/drama.html">Drama</a></li>
            <li><a href="${prefix}category/comedy.html">Comedy</a></li>
            <li><a href="${prefix}category/sci-fi.html">Sci-Fi</a></li>
          </ul>
        </div>
        <div>
          <h4 class="footer-heading">Information</h4>
          <ul class="footer-links">
            <li><a href="${prefix}about.html">About Us</a></li>
            <li><a href="${prefix}contact.html">Contact</a></li>
            <li><a href="${prefix}privacy.html">Privacy Policy</a></li>
            <li><a href="${prefix}disclaimer.html">Disclaimer & DMCA</a></li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom">
        <p>&copy; ${year} CineStatic. Built for high performance on GitHub Pages.</p>
        <p>Pure Static HTML5 &bull; No Server Runtime &bull; Fast Delivery</p>
      </div>
    </div>
  </footer>
  <div class="toast-notice" id="toast" role="status" aria-live="polite"></div>
  <script src="${prefix}assets/js/app.js" defer></script>
`;
}

// Generate Movie Card HTML
function renderMovieCardHtml(movie, depth) {
  const prefix = depth === 1 ? '../' : '';
  const detailUrl = `${prefix}movies/${encodeURIComponent(movie.slug)}.html`;
  const posterSrc = movie.poster || `${prefix}assets/images/default-poster.svg`;
  const fallbackSrc = `${prefix}assets/images/default-poster.svg`;
  const topQuality = movie.qualities && movie.qualities.length ? movie.qualities[movie.qualities.length - 1] : 'HD';
  const is4K = topQuality.toUpperCase().includes('4K');
  const badgeClass = is4K ? 'card-badge-top-right card-badge-4k' : 'card-badge-top-right';
  const genresShort = movie.genres ? movie.genres.slice(0, 2).join(', ') : '';

  return `
    <article class="movie-card" data-id="${escapeHtml(movie.id)}">
      <a href="${detailUrl}" class="card-poster-link" aria-label="View details for ${escapeHtml(movie.title)}">
        <span class="card-badge-top-left">${escapeHtml(movie.language || 'Multi')}</span>
        <span class="${badgeClass}">${escapeHtml(topQuality)}</span>
        ${movie.rating ? `
          <span class="card-rating-badge">
            <svg viewBox="0 0 24 24"><polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"></polygon></svg>
            ${movie.rating}
          </span>
        ` : ''}
        <img 
          src="${posterSrc}" 
          alt="${escapeHtml(movie.title)} Poster" 
          class="card-poster-img" 
          loading="lazy" 
          width="300" 
          height="450"
          onerror="window.handleImageError && window.handleImageError(this, '${fallbackSrc}')"
        />
      </a>
      <div class="card-body">
        <h3 class="card-title">
          <a href="${detailUrl}">${escapeHtml(movie.title)}</a>
        </h3>
        <div class="card-meta">
          <span>${movie.releaseYear || ''}</span>
          <span>${escapeHtml(movie.runtime || '')}</span>
        </div>
        ${genresShort ? `<div class="card-genres">${escapeHtml(genresShort)}</div>` : ''}
        <a href="${detailUrl}" class="card-download-btn" aria-label="Download ${escapeHtml(movie.title)}">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
          <span>Download</span>
        </a>
      </div>
    </article>
  `;
}

// -------------------------------------------------------------
// 1. GENERATE INDIVIDUAL MOVIE DETAIL PAGES (movies/[slug].html)
// -------------------------------------------------------------
console.log('Generating individual movie detail pages...');

movies.forEach(movie => {
  const filePath = path.join(MOVIES_OUT_DIR, `${movie.slug}.html`);
  const topQuality = movie.qualities && movie.qualities.length ? movie.qualities[movie.qualities.length - 1] : 'HD';

  // Find related movies (same category or shared genres, excluding current)
  const relatedMovies = movies.filter(m => {
    if (m.id === movie.id) return false;
    const sameCat = m.categories && movie.categories && m.categories.some(c => movie.categories.includes(c));
    const sameGenre = m.genres && movie.genres && m.genres.some(g => movie.genres.includes(g));
    return sameCat || sameGenre;
  }).slice(0, 4);

  // File size text
  let fileSizesText = '';
  if (movie.fileSizes) {
    if (typeof movie.fileSizes === 'object') {
      fileSizesText = Object.entries(movie.fileSizes).map(([k, v]) => `${k}: ${v}`).join(' | ');
    } else {
      fileSizesText = String(movie.fileSizes);
    }
  }

  // Audio / languages text
  const audioText = movie.languagesAvailable ? movie.languagesAvailable.join(', ') : (movie.language || 'Original');

  // Single Full HD Download link
  const fullHdLink = (movie.links && movie.links.length) ? (
    movie.links.find(l => (l.quality && l.quality.includes('1080p')) || (l.label && l.label.toLowerCase().includes('1080p'))) ||
    movie.links.find(l => (l.quality && l.quality.toUpperCase().includes('4K')) || (l.label && l.label.toUpperCase().includes('4K'))) ||
    movie.links.find(l => (l.quality && l.quality.includes('720p')) || (l.label && l.label.toLowerCase().includes('720p'))) ||
    movie.links[movie.links.length - 1]
  ) : null;

  // Schema.org JSON-LD structured data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Movie",
    "name": movie.title,
    "image": movie.poster,
    "description": movie.synopsis || movie.description,
    "dateCreated": String(movie.releaseYear),
    "director": movie.director && movie.director !== 'N/A' ? { "@type": "Person", "name": movie.director } : undefined,
    "actor": movie.cast ? movie.cast.map(c => ({ "@type": "Person", "name": c })) : undefined,
    "aggregateRating": movie.rating ? {
      "@type": "AggregateRating",
      "ratingValue": String(movie.rating),
      "bestRating": "10",
      "ratingCount": "100"
    } : undefined
  };

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(movie.seoTitle || `${movie.title} (${movie.releaseYear}) - Download | CineStatic`)}</title>
  <meta name="description" content="${escapeHtml(movie.seoDescription || movie.synopsis || `Download ${movie.title} in HD and 4K.`)}">
  <link rel="canonical" href="movies/${encodeURIComponent(movie.slug)}.html">
  
  <!-- Open Graph / Social Sharing -->
  <meta property="og:type" content="video.movie">
  <meta property="og:title" content="${escapeHtml(movie.title)} (${movie.releaseYear})">
  <meta property="og:description" content="${escapeHtml(movie.synopsis || movie.description || '')}">
  <meta property="og:image" content="${movie.poster || '../assets/images/default-poster.svg'}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${escapeHtml(movie.title)} (${movie.releaseYear})">
  <meta name="twitter:description" content="${escapeHtml(movie.synopsis || '')}">
  <meta name="twitter:image" content="${movie.poster || '../assets/images/default-poster.svg'}">

  <link rel="stylesheet" href="../assets/css/styles.css">
  <script type="application/ld+json">
    ${JSON.stringify(jsonLd)}
  </script>
</head>
<body>
  ${getHeaderHtml('movies', 1)}

  <main class="main-content" id="main-content">
    <div class="container">
      <!-- Breadcrumb Navigation -->
      <nav class="breadcrumbs" aria-label="Breadcrumbs">
        <a href="../index.html">Home</a>
        <span class="separator">/</span>
        <a href="../movies.html">Movies</a>
        ${movie.categories && movie.categories[0] ? `
          <span class="separator">/</span>
          <a href="../category/${encodeURIComponent(movie.categories[0])}.html">${escapeHtml(movie.categories[0].replace('-', ' ').toUpperCase())}</a>
        ` : ''}
        <span class="separator">/</span>
        <span class="current">${escapeHtml(movie.title)}</span>
      </nav>

      <div class="movie-detail-grid">
        <!-- Poster Column -->
        <div class="movie-poster-column">
          <div class="detail-poster-wrap">
            <img 
              src="${movie.poster || '../assets/images/default-poster.svg'}" 
              alt="${escapeHtml(movie.title)} Official Poster" 
              width="400" 
              height="600"
              onerror="window.handleImageError && window.handleImageError(this, '../assets/images/default-poster.svg')"
            />
          </div>
          <a href="${fullHdLink ? escapeHtml(fullHdLink.url) : '#download-options'}" target="_blank" rel="noopener noreferrer" class="poster-download-btn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
            <span>Full HD Download</span>
          </a>
        </div>

        <!-- Info Column -->
        <div class="movie-info-column">
          <h1 class="detail-title">${escapeHtml(movie.title)}</h1>
          ${movie.originalTitle ? `<p class="detail-original-title">Original Title: ${escapeHtml(movie.originalTitle)}</p>` : ''}

          <div class="detail-meta-pills">
            <span class="meta-pill">${movie.releaseYear || ''}</span>
            ${movie.runtime ? `<span class="meta-pill">${escapeHtml(movie.runtime)}</span>` : ''}
            <span class="meta-pill">${escapeHtml(movie.language || 'Hindi Dubbed')}</span>
            <span class="meta-pill">${escapeHtml(topQuality)}</span>
            ${movie.rating ? `
              <span class="meta-pill meta-pill-rating">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"></polygon></svg>
                ${movie.rating} ${movie.ratingSource ? `(${escapeHtml(movie.ratingSource)})` : ''}
              </span>
            ` : ''}
          </div>

          ${movie.genres && movie.genres.length ? `
            <div class="genre-tags">
              ${movie.genres.map(g => `<span class="genre-tag">${escapeHtml(g)}</span>`).join('')}
            </div>
          ` : ''}

          <!-- Synopsis -->
          <div class="synopsis-block">
            <h2>Storyline</h2>
            <p class="synopsis-text">${escapeHtml(movie.description || movie.synopsis || '')}</p>
          </div>

          <!-- Technical Specs Table -->
          <div class="specs-table-wrap">
            <table class="specs-table">
              <tbody>
                ${movie.director && movie.director !== 'N/A' ? `<tr><th>Director</th><td>${escapeHtml(movie.director)}</td></tr>` : ''}
                ${movie.cast && movie.cast.length ? `<tr><th>Starring</th><td>${escapeHtml(movie.cast.join(', '))}</td></tr>` : ''}
                ${movie.country ? `<tr><th>Country</th><td>${escapeHtml(movie.country)}</td></tr>` : ''}
                <tr><th>Audio Languages</th><td>${escapeHtml(audioText)}</td></tr>
                ${movie.subtitles && movie.subtitles.length ? `<tr><th>Subtitles</th><td>${escapeHtml(movie.subtitles.join(', '))}</td></tr>` : ''}
                ${movie.qualities && movie.qualities.length ? `<tr><th>Available Qualities</th><td>${escapeHtml(movie.qualities.join(', '))}</td></tr>` : ''}
                ${fileSizesText ? `<tr><th>File Sizes</th><td>${escapeHtml(fileSizesText)}</td></tr>` : ''}
                ${movie.formats && movie.formats.length ? `<tr><th>Container Formats</th><td>${escapeHtml(movie.formats.join(', '))}</td></tr>` : ''}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Screenshots Gallery (Full-Width Layout - Large Uncropped Previews) -->
      ${movie.screenshots && movie.screenshots.length ? `
        <section class="screenshots-section">
          <h2 class="detail-section-title">Movie Screenshots</h2>
          <div class="screenshots-grid">
            ${movie.screenshots.map((src, idx) => `
              <a href="${escapeHtml(src)}" target="_blank" rel="noopener noreferrer" class="screenshot-item" title="View Full Screenshot ${idx + 1}">
                <img 
                  src="${escapeHtml(src)}" 
                  alt="${escapeHtml(movie.title)} Screenshot ${idx + 1}" 
                  loading="lazy" 
                  onerror="this.parentElement.style.display='none'"
                />
              </a>
            `).join('')}
          </div>
        </section>
      ` : ''}

      <!-- Direct Download - Single Full HD Button (All Others Removed) -->
      <div class="download-action-box" id="download-options">
        <div class="action-header">
          <h3>Fast Direct Download</h3>
          <p>High speed direct cloud link in 1080p Full HD resolution.</p>
        </div>
        
        <div class="links-list">
          ${fullHdLink ? `
            <a href="${escapeHtml(fullHdLink.url)}" target="_blank" rel="noopener noreferrer" class="link-btn-card full-hd-btn">
              <div class="link-btn-left">
                <div class="link-icon-wrap">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                </div>
                <div class="link-info-text">
                  <span class="link-label">Full HD Download</span>
                  <span class="link-submeta">
                    1080p Full HD ${fullHdLink.size ? `&bull; ${escapeHtml(fullHdLink.size)}` : ''} &bull; Fast Direct Server
                  </span>
                </div>
              </div>
              <span class="link-cta-badge">
                Full HD Download
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
              </span>
            </a>
          ` : `
            <p style="color: var(--text-secondary); font-size: 0.9rem;">Download link is currently being updated for this title.</p>
          `}
        </div>
      </div>

      <!-- Share Section -->
      <div class="share-section">
        <span class="share-label">Share This Movie:</span>
        <button class="share-btn" onclick="window.copyPageUrl()" title="Copy Page Link">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
          <span>Copy Link</span>
        </button>
        <a href="https://api.whatsapp.com/send?text=${encodeURIComponent(`${movie.title} (${movie.releaseYear}) on CineStatic`)}" target="_blank" rel="noopener noreferrer" class="share-btn">
          <span>WhatsApp</span>
        </a>
        <a href="https://twitter.com/intent/tweet?text=${encodeURIComponent(`Check out ${movie.title} (${movie.releaseYear}) on CineStatic`)}" target="_blank" rel="noopener noreferrer" class="share-btn">
          <span>X / Twitter</span>
        </a>
        <a href="https://t.me/share/url?url=&text=${encodeURIComponent(`${movie.title} (${movie.releaseYear}) on CineStatic`)}" target="_blank" rel="noopener noreferrer" class="share-btn">
          <span>Telegram</span>
        </a>
      </div>

      <!-- Related Movies Section -->
      ${relatedMovies.length ? `
        <section class="related-section">
          <div class="section-header">
            <h2 class="section-title">You Might Also Like</h2>
            <a href="../movies.html" class="section-link">View All Movies &rarr;</a>
          </div>
          <div class="movies-grid">
            ${relatedMovies.map(m => renderMovieCardHtml(m, 1)).join('')}
          </div>
        </section>
      ` : ''}

    </div>
  </main>

  ${getFooterHtml(1)}
</body>
</html>`;

  fs.writeFileSync(filePath, html, 'utf-8');
});

console.log(`Successfully generated ${movies.length} static movie pages.`);

// -------------------------------------------------------------
// 2. GENERATE CATEGORY PAGES (category/[slug].html)
// -------------------------------------------------------------
console.log('Generating category pages...');

categories.forEach(cat => {
  const filePath = path.join(CATEGORY_OUT_DIR, `${cat.slug}.html`);

  const matchingMovies = movies.filter(m => {
    const inCats = m.categories && m.categories.includes(cat.slug);
    const inGenres = m.genres && m.genres.some(g => g.toLowerCase().includes(cat.slug.toLowerCase()));
    return inCats || inGenres;
  });

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(cat.seoTitle || `${cat.name} Movies - Download | CineStatic`)}</title>
  <meta name="description" content="${escapeHtml(cat.seoDescription || cat.description || `Browse the best ${cat.name} movies with dual audio and full HD downloads.`)}">
  <link rel="canonical" href="category/${encodeURIComponent(cat.slug)}.html">
  <link rel="stylesheet" href="../assets/css/styles.css">
</head>
<body>
  ${getHeaderHtml(cat.slug, 1)}

  <main class="main-content" id="main-content">
    <div class="container">
      <!-- Breadcrumbs -->
      <nav class="breadcrumbs" aria-label="Breadcrumbs">
        <a href="../index.html">Home</a>
        <span class="separator">/</span>
        <a href="../movies.html">Categories</a>
        <span class="separator">/</span>
        <span class="current">${escapeHtml(cat.name)}</span>
      </nav>

      <div class="section-header">
        <div>
          <h1 class="section-title">${escapeHtml(cat.name)} Collection</h1>
          <p style="color: var(--text-secondary); font-size: 0.95rem; margin-top: 6px;">
            ${escapeHtml(cat.description || '')} (${matchingMovies.length} title${matchingMovies.length === 1 ? '' : 's'})
          </p>
        </div>
        <a href="../search.html?category=${encodeURIComponent(cat.slug)}" class="section-link">Filter Category &rarr;</a>
      </div>

      ${matchingMovies.length ? `
        <div class="movies-grid">
          ${matchingMovies.map(m => renderMovieCardHtml(m, 1)).join('')}
        </div>
      ` : `
        <div class="empty-state">
          <h3>No titles found</h3>
          <p>We are actively adding more titles to the ${escapeHtml(cat.name)} collection.</p>
          <a href="../movies.html" class="btn-primary">Browse All Movies</a>
        </div>
      `}
    </div>
  </main>

  ${getFooterHtml(1)}
</body>
</html>`;

  fs.writeFileSync(filePath, html, 'utf-8');
});

console.log(`Successfully generated ${categories.length} category pages.`);

// -------------------------------------------------------------
// 3. GENERATE DYNAMIC HOMEPAGE (index.html)
// -------------------------------------------------------------
console.log('Generating index.html from central dataset...');

const featuredCarouselList = movies.slice(0, 15);
const latestList = movies.slice(0, 12);
const firstMovie = featuredCarouselList[0] || movies[0];

const indexHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>CineStatic - South Hindi Dubbed Movies Download | 4K & 1080p</title>
  <meta name="description" content="Discover and download the latest South Indian Hindi dubbed movies, dual audio releases, and blockbusters with screenshots and direct download links.">
  <link rel="canonical" href="index.html">

  <!-- Open Graph -->
  <meta property="og:type" content="website">
  <meta property="og:title" content="CineStatic - South Hindi Dubbed Movies">
  <meta property="og:description" content="Direct high-speed downloads, real screenshots, dual audio South Hindi films.">
  <meta property="og:image" content="${firstMovie.poster}">
  <meta name="twitter:card" content="summary_large_image">

  <link rel="stylesheet" href="assets/css/styles.css">
</head>
<body>
  ${getHeaderHtml('home', 0)}

  <!-- Hero Multi-Card Carousel (Proper Card Sized, Multiple in Line) -->
  <section class="hero-carousel-section" aria-label="Featured Releases Carousel">
    <div class="container">
      <div class="carousel-header">
        <div class="carousel-title-group">
          <span class="carousel-badge">🔥 Spotlight Reel</span>
          <h2 class="carousel-title">Trending &amp; Latest Releases</h2>
        </div>
        <div class="carousel-controls">
          <button class="carousel-arrow carousel-arrow-prev" id="heroPrevBtn" aria-label="Scroll left">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 18 9 12 15 6"></polyline></svg>
          </button>
          <button class="carousel-arrow carousel-arrow-next" id="heroNextBtn" aria-label="Scroll right">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"></polyline></svg>
          </button>
        </div>
      </div>

      <div class="carousel-wrapper">
        <button class="carousel-float-arrow float-prev" id="floatPrevBtn" aria-label="Scroll previous">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 18 9 12 15 6"></polyline></svg>
        </button>

        <div class="carousel-track" id="heroTrack" tabindex="0" role="region" aria-label="Featured movie cards">
          ${featuredCarouselList.map(m => renderMovieCardHtml(m, 0)).join('')}
        </div>

        <button class="carousel-float-arrow float-next" id="floatNextBtn" aria-label="Scroll next">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"></polyline></svg>
        </button>
      </div>
    </div>
  </section>

  <!-- Category Browse Bar -->
  <section class="category-bar-section" aria-label="Browse Categories">
    <div class="container">
      <div class="category-scroll-container">
        <a href="movies.html" class="category-chip active">All Movies</a>
        <a href="category/south-indian.html" class="category-chip">South Indian</a>
        <a href="category/hindi-dubbed.html" class="category-chip">Hindi Dubbed</a>
        <a href="category/action.html" class="category-chip">Action</a>
        <a href="category/thriller.html" class="category-chip">Thriller</a>
        <a href="category/bollywood.html" class="category-chip">Bollywood</a>
        <a href="category/hollywood.html" class="category-chip">Hollywood</a>
        <a href="category/web-series.html" class="category-chip">Web Series</a>
      </div>
    </div>
  </section>

  <!-- Main Content: Movie Grids -->
  <main class="main-content" id="main-content">
    <div class="container">
      
      <!-- Latest Releases Section -->
      <section class="catalog-section" aria-labelledby="latest-heading">
        <div class="section-header">
          <h2 id="latest-heading" class="section-title">Latest South Hindi Releases</h2>
          <a href="movies.html" class="section-link">View Full Catalog &rarr;</a>
        </div>
        
        <div class="movies-grid">
          ${latestList.map(m => renderMovieCardHtml(m, 0)).join('')}
        </div>
      </section>

    </div>
  </main>

  ${getFooterHtml(0)}
  <script src="assets/js/hero-slider.js" defer></script>
</body>
</html>`;

fs.writeFileSync(path.join(ROOT_DIR, 'index.html'), indexHtml, 'utf-8');
console.log('Successfully updated index.html.');

// -------------------------------------------------------------
// 4. GENERATE DYNAMIC CATALOG (movies.html)
// -------------------------------------------------------------
console.log('Generating movies.html fallback catalog...');

const moviesHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>All Movies - Explore Our Complete Catalog | CineStatic</title>
  <meta name="description" content="Browse our complete collection of South Indian Hindi Dubbed movies. Filter by quality (4K, 1080p), audio, and genre.">
  <link rel="canonical" href="movies.html">
  <link rel="stylesheet" href="assets/css/styles.css">
</head>
<body>
  ${getHeaderHtml('movies', 0)}

  <main class="main-content" id="main-content">
    <div class="container">
      <nav class="breadcrumbs" aria-label="Breadcrumbs">
        <a href="index.html">Home</a>
        <span class="separator">/</span>
        <span class="current">All Movies</span>
      </nav>

      <div class="section-header" style="flex-wrap: wrap; gap: 16px;">
        <div>
          <h1 class="section-title">Movie Catalog</h1>
          <p style="color: var(--text-secondary); font-size: 0.95rem; margin-top: 4px;">
            Explore our curated database of South Indian Hindi dubbed movies.
          </p>
        </div>

        <div class="filter-controls-row">
          <select id="filter-category" class="filter-select" aria-label="Filter by Category">
            <option value="all">All Categories</option>
            <option value="south-indian">South Indian</option>
            <option value="hindi-dubbed">Hindi Dubbed</option>
            <option value="action">Action</option>
            <option value="thriller">Thriller</option>
            <option value="bollywood">Bollywood</option>
            <option value="hollywood">Hollywood</option>
          </select>

          <select id="filter-quality" class="filter-select" aria-label="Filter by Quality">
            <option value="all">All Qualities</option>
            <option value="4K UHD">4K UHD</option>
            <option value="1080p">1080p Full HD</option>
            <option value="720p">720p HD</option>
            <option value="480p">480p</option>
          </select>

          <select id="filter-language" class="filter-select" aria-label="Filter by Language">
            <option value="all">All Languages</option>
            <option value="hindi">Hindi</option>
            <option value="kannada">Kannada</option>
            <option value="telugu">Telugu</option>
            <option value="tamil">Tamil</option>
            <option value="malayalam">Malayalam</option>
          </select>

          <select id="filter-sort" class="filter-select" aria-label="Sort Movies">
            <option value="latest">Sort: Recently Added</option>
            <option value="rating">Sort: Highest Rated</option>
            <option value="year">Sort: Release Year</option>
            <option value="title">Sort: Title (A-Z)</option>
          </select>

          <button id="reset-filters-btn" class="clear-btn" type="button">Reset</button>
        </div>
      </div>

      <div class="results-status-bar">
        <span id="catalog-count">Showing ${movies.length} movies</span>
      </div>

      <div class="movies-grid" id="catalog-grid">
        ${movies.map(m => renderMovieCardHtml(m, 0)).join('')}
      </div>

      <div id="catalog-empty" class="empty-state" style="display: none;">
        <svg class="empty-state-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
        <h3>No matching movies found</h3>
        <p>Try adjusting your category, quality, or language filters.</p>
        <button class="btn-primary" onclick="document.getElementById('reset-filters-btn').click()">Reset Filters</button>
      </div>

    </div>
  </main>

  ${getFooterHtml(0)}
  <script src="assets/js/catalog.js" defer></script>
</body>
</html>`;

fs.writeFileSync(path.join(ROOT_DIR, 'movies.html'), moviesHtml, 'utf-8');
console.log('Successfully updated movies.html.');

// -------------------------------------------------------------
// 5. GENERATE SITEMAP (sitemap.xml)
// -------------------------------------------------------------
console.log('Generating sitemap.xml...');

const todayStr = new Date().toISOString().split('T')[0];

let sitemapEntries = [
  { loc: 'index.html', priority: '1.0', changefreq: 'daily' },
  { loc: 'movies.html', priority: '0.9', changefreq: 'daily' },
  { loc: 'search.html', priority: '0.8', changefreq: 'weekly' },
  { loc: 'about.html', priority: '0.5', changefreq: 'monthly' },
  { loc: 'contact.html', priority: '0.5', changefreq: 'monthly' },
  { loc: 'privacy.html', priority: '0.3', changefreq: 'monthly' },
  { loc: 'disclaimer.html', priority: '0.3', changefreq: 'monthly' }
];

categories.forEach(cat => {
  sitemapEntries.push({
    loc: `category/${cat.slug}.html`,
    priority: '0.8',
    changefreq: 'daily'
  });
});

movies.forEach(movie => {
  sitemapEntries.push({
    loc: `movies/${movie.slug}.html`,
    priority: '0.9',
    changefreq: 'weekly'
  });
});

const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapEntries.map(e => `  <url>
    <loc>${e.loc}</loc>
    <lastmod>${todayStr}</lastmod>
    <changefreq>${e.changefreq}</changefreq>
    <priority>${e.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

fs.writeFileSync(path.join(ROOT_DIR, 'sitemap.xml'), sitemapXml, 'utf-8');
console.log(`Generated sitemap.xml with ${sitemapEntries.length} URLs.`);

// -------------------------------------------------------------
// 6. GENERATE ROBOTS.TXT
// -------------------------------------------------------------
const robotsTxt = `User-agent: *
Allow: /

Sitemap: sitemap.xml
`;
fs.writeFileSync(path.join(ROOT_DIR, 'robots.txt'), robotsTxt, 'utf-8');
console.log('Generated robots.txt.');

console.log('Build complete! All static pages and sitemap are up to date.');
