/**
 * MovieHub4u - Static Site Generator
 * Generates pre-rendered HTML for all movie pages, category pages, index.html, movies.html, and sitemap.xml.
 * Inspired by HDHub4u Layout & Theme - Modernized, Ad-Free, Ultra-Performant Pure Static HTML.
 * Pure Node.js Standard Library - Zero external npm dependencies.
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

// Reusable Navigation Header HTML (HDHub4u Signature Dual-Tier)
function getHeaderHtml(activeTab, depth) {
  const prefix = depth === 1 ? '../' : '';
  return `
  <!-- Header (HDHub4u Signature Dual-Tier) -->
  <header class="site-header" role="banner">
    <div class="container header-top">
      <div class="brand-wrap">
        <a href="${prefix}index.html" aria-label="MovieHub4u Home">
          <img src="${prefix}assets/images/logo.svg" alt="MovieHub4u Logo" class="brand-logo" width="165" height="38" />
        </a>
      </div>

      <form class="header-search-bar" action="${prefix}search.html" method="get" role="search">
        <input 
          type="search" 
          name="q" 
          class="header-search-input" 
          placeholder="Search South Hindi, 4K, 1080p, Actors..." 
          aria-label="Search movies"
          autocomplete="off"
        />
        <button type="submit" class="header-search-btn" aria-label="Search">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
        </button>
      </form>

      <button class="mobile-menu-toggle" aria-label="Open Mobile Menu" aria-expanded="false">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
      </button>
    </div>

    <!-- Category Nav Strip -->
    <nav class="nav-strip" aria-label="Primary Navigation">
      <div class="container nav-strip-inner">
        <a href="${prefix}index.html" class="nav-strip-link ${activeTab === 'home' ? 'active' : ''}">⚡ Home</a>
        <a href="${prefix}movies.html" class="nav-strip-link ${activeTab === 'movies' ? 'active' : ''}">All Movies</a>
        <a href="${prefix}category/south-indian.html" class="nav-strip-link ${activeTab === 'south-indian' ? 'active' : ''}">South Hindi</a>
        <a href="${prefix}category/hindi-dubbed.html" class="nav-strip-link ${activeTab === 'hindi-dubbed' ? 'active' : ''}">Hindi Dubbed</a>
        <a href="${prefix}category/action.html" class="nav-strip-link ${activeTab === 'action' ? 'active' : ''}">Action</a>
        <a href="${prefix}category/thriller.html" class="nav-strip-link ${activeTab === 'thriller' ? 'active' : ''}">Thriller</a>
        <a href="${prefix}category/bollywood.html" class="nav-strip-link ${activeTab === 'bollywood' ? 'active' : ''}">Bollywood</a>
        <a href="${prefix}category/hollywood.html" class="nav-strip-link ${activeTab === 'hollywood' ? 'active' : ''}">Hollywood</a>
        <a href="${prefix}category/web-series.html" class="nav-strip-link ${activeTab === 'web-series' ? 'active' : ''}">Web Series</a>
        <a href="${prefix}search.html" class="nav-strip-link ${activeTab === 'search' ? 'active' : ''}">🔍 Search</a>
      </div>
    </nav>

    <!-- Mobile Drawer -->
    <div class="mobile-nav-drawer" role="dialog" aria-label="Mobile Navigation">
      <a href="${prefix}index.html">⚡ Home</a>
      <a href="${prefix}movies.html">All Movies</a>
      <a href="${prefix}search.html">🔍 Search &amp; Filters</a>
      <a href="${prefix}category/south-indian.html">South Hindi</a>
      <a href="${prefix}category/hindi-dubbed.html">Hindi Dubbed</a>
      <a href="${prefix}category/action.html">Action</a>
      <a href="${prefix}category/thriller.html">Thriller</a>
      <a href="${prefix}category/bollywood.html">Bollywood</a>
      <a href="${prefix}category/hollywood.html">Hollywood</a>
      <a href="${prefix}category/web-series.html">Web Series</a>
    </div>
  </header>

  <!-- HDHub4u Signature Announcement Ribbon -->
  <div class="notice-ribbon" role="region" aria-label="Announcement">
    <div class="container">
      ⚡ <strong>Official MovieHub4u:</strong> Download South Indian Hindi Dubbed Movies &bull; Pure Fast Direct Links &bull; 4K &bull; 1080p &bull; No Ads &bull; No Popups!
    </div>
  </div>
`;
}

// Reusable Footer HTML
function getFooterHtml(depth) {
  const prefix = depth === 1 ? '../' : '';
  const year = new Date().getFullYear();
  return `
  <!-- Footer (HDHub4u Clean Style) -->
  <footer class="site-footer-hub" role="contentinfo">
    <div class="container footer-hub-content">
      <a href="${prefix}index.html" aria-label="MovieHub4u Home">
        <img src="${prefix}assets/images/logo.svg" alt="MovieHub4u Logo" width="160" height="38" />
      </a>
      <div class="footer-nav-hub">
        <a href="${prefix}index.html">Home</a>
        <a href="${prefix}movies.html">All Movies</a>
        <a href="${prefix}category/south-indian.html">South Indian</a>
        <a href="${prefix}category/hindi-dubbed.html">Hindi Dubbed</a>
        <a href="${prefix}category/action.html">Action</a>
        <a href="${prefix}about.html">About Us</a>
        <a href="${prefix}contact.html">Contact</a>
        <a href="${prefix}privacy.html">Privacy Policy</a>
        <a href="${prefix}disclaimer.html">Disclaimer &amp; DMCA</a>
      </div>
      <p class="footer-copy">
        &copy; ${year} MovieHub4u &bull; Pure Static High Performance &bull; Hosted on GitHub Pages &bull; No Annoying Ads &bull; Fast Delivery
      </p>
    </div>
  </footer>
  <div class="toast-notice" id="toast" role="status" aria-live="polite"></div>
  <script src="${prefix}assets/js/app.js" defer></script>
`;
}

// Generate Movie Card HTML (HDHub4u Signature Dense Card)
function renderMovieCardHtml(movie, depth) {
  const prefix = depth === 1 ? '../' : '';
  const detailUrl = `${prefix}movies/${encodeURIComponent(movie.slug)}.html`;
  const posterSrc = movie.poster || `${prefix}assets/images/default-poster.svg`;
  const fallbackSrc = `${prefix}assets/images/default-poster.svg`;
  const topQuality = movie.qualities && movie.qualities.length ? movie.qualities[movie.qualities.length - 1] : 'HD';
  const is4K = topQuality.toUpperCase().includes('4K');
  const badgeClass = is4K ? 'badge-quality badge-quality-4k' : 'badge-quality';

  return `
    <article class="hub-card movie-card" data-id="${escapeHtml(movie.id)}">
      <a href="${detailUrl}" class="hub-card-poster" aria-label="Download ${escapeHtml(movie.title)}">
        <span class="badge-audio">${escapeHtml(movie.language || 'Hindi')}</span>
        <span class="${badgeClass}">${escapeHtml(topQuality)}</span>
        ${movie.rating ? `
          <span class="badge-rating">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"></polygon></svg>
            ${movie.rating}
          </span>
        ` : ''}
        <img 
          src="${posterSrc}" 
          alt="${escapeHtml(movie.title)} Poster" 
          class="hub-card-img" 
          loading="lazy" 
          width="300" 
          height="450"
          onerror="window.handleImageError && window.handleImageError(this, '${fallbackSrc}')"
        />
      </a>
      <div class="hub-card-caption">
        <h3 class="hub-card-title">
          <a href="${detailUrl}">${escapeHtml(movie.title)}</a>
        </h3>
        <div class="hub-card-footer">
          <span>${movie.releaseYear || ''}</span>
          <span>${escapeHtml(movie.runtime || 'HD')}</span>
        </div>
      </div>
    </article>
  `;
}

// -------------------------------------------------------------
// 1. GENERATE INDIVIDUAL MOVIE DETAIL PAGES (movies/[slug].html)
// -------------------------------------------------------------
console.log('Generating individual movie detail pages (HDHub4u layout)...');

movies.forEach(movie => {
  const filePath = path.join(MOVIES_OUT_DIR, `${movie.slug}.html`);
  const topQuality = movie.qualities && movie.qualities.length ? movie.qualities[movie.qualities.length - 1] : 'HD';

  // Find related movies (same category or shared genres, excluding current)
  const relatedMovies = movies.filter(m => {
    if (m.id === movie.id) return false;
    const sameCat = m.categories && movie.categories && m.categories.some(c => movie.categories.includes(c));
    const sameGenre = m.genres && movie.genres && m.genres.some(g => movie.genres.includes(g));
    return sameCat || sameGenre;
  }).slice(0, 6);

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
  const audioText = movie.languagesAvailable ? movie.languagesAvailable.join(', ') : (movie.language || 'Hindi Dubbed');

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
  <title>${escapeHtml(movie.seoTitle || `${movie.title} (${movie.releaseYear}) Download | MovieHub4u`)}</title>
  <meta name="description" content="${escapeHtml(movie.seoDescription || movie.synopsis || `Download ${movie.title} in HD and 4K with fast links.`)}">
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
      <nav class="breadcrumbs-bar" aria-label="Breadcrumbs">
        <a href="../index.html">Home</a>
        <span>&raquo;</span>
        <a href="../movies.html">Movies</a>
        ${movie.categories && movie.categories[0] ? `
          <span>&raquo;</span>
          <a href="../category/${encodeURIComponent(movie.categories[0])}.html">${escapeHtml(movie.categories[0].replace('-', ' ').toUpperCase())}</a>
        ` : ''}
        <span>&raquo;</span>
        <span>${escapeHtml(movie.title)}</span>
      </nav>

      <!-- Post Header Banner (HDHub4u Signature Title) -->
      <div class="post-header-card">
        <h1 class="post-main-title">${escapeHtml(movie.title)} (${movie.releaseYear}) Dual Audio [Hindi-Original] WEB-DL 480p 720p 1080p 4K</h1>
        <div class="post-meta-strip">
          <span class="post-cat-badge">${escapeHtml(movie.language || 'Hindi Dubbed')}</span>
          <span class="post-meta-item">📅 ${movie.releaseYear || ''}</span>
          ${movie.runtime ? `<span class="post-meta-item">⏱️ ${escapeHtml(movie.runtime)}</span>` : ''}
          ${movie.rating ? `<span class="post-meta-item" style="color: var(--accent-gold); font-weight: 700;">★ IMDb ${movie.rating}/10</span>` : ''}
          ${movie.genres && movie.genres.length ? `<span class="post-meta-item">🏷️ ${escapeHtml(movie.genres.join(', '))}</span>` : ''}
        </div>
      </div>

      <!-- Centered Main Poster Presentation (HDHub4u Style) -->
      <div class="detail-center-poster">
        <img 
          src="${movie.poster || '../assets/images/default-poster.svg'}" 
          alt="${escapeHtml(movie.title)} Official Poster" 
          width="320" 
          height="480"
          onerror="window.handleImageError && window.handleImageError(this, '../assets/images/default-poster.svg')"
        />
      </div>

      <!-- Technical Specifications Box (HDHub4u Specs Table) -->
      <div class="specs-card-hub">
        <div class="specs-grid-row">
          <div class="specs-label">Movie Title:</div>
          <div class="specs-val"><strong>${escapeHtml(movie.title)}</strong></div>
        </div>
        ${movie.originalTitle ? `
        <div class="specs-grid-row">
          <div class="specs-label">Original Title:</div>
          <div class="specs-val">${escapeHtml(movie.originalTitle)}</div>
        </div>` : ''}
        <div class="specs-grid-row">
          <div class="specs-label">Release Year:</div>
          <div class="specs-val">${movie.releaseYear || ''}</div>
        </div>
        <div class="specs-grid-row">
          <div class="specs-label">Audio / Language:</div>
          <div class="specs-val">${escapeHtml(audioText)}</div>
        </div>
        ${movie.subtitles && movie.subtitles.length ? `
        <div class="specs-grid-row">
          <div class="specs-label">Subtitles:</div>
          <div class="specs-val">${escapeHtml(movie.subtitles.join(', '))}</div>
        </div>` : ''}
        <div class="specs-grid-row">
          <div class="specs-label">Qualities Available:</div>
          <div class="specs-val">${escapeHtml(movie.qualities ? movie.qualities.join(', ') : '480p, 720p, 1080p, 4K')}</div>
        </div>
        ${fileSizesText ? `
        <div class="specs-grid-row">
          <div class="specs-label">File Size:</div>
          <div class="specs-val">${escapeHtml(fileSizesText)}</div>
        </div>` : ''}
        ${movie.formats && movie.formats.length ? `
        <div class="specs-grid-row">
          <div class="specs-label">Format:</div>
          <div class="specs-val">${escapeHtml(movie.formats.join(', '))}</div>
        </div>` : ''}
        ${movie.director && movie.director !== 'N/A' ? `
        <div class="specs-grid-row">
          <div class="specs-label">Director:</div>
          <div class="specs-val">${escapeHtml(movie.director)}</div>
        </div>` : ''}
        ${movie.cast && movie.cast.length ? `
        <div class="specs-grid-row">
          <div class="specs-label">Star Cast:</div>
          <div class="specs-val">${escapeHtml(movie.cast.join(', '))}</div>
        </div>` : ''}
        ${movie.rating ? `
        <div class="specs-grid-row">
          <div class="specs-label">IMDb Rating:</div>
          <div class="specs-val imdb-val">★ ${movie.rating}/10 (${escapeHtml(movie.ratingSource || 'IMDb')})</div>
        </div>` : ''}
      </div>

      <!-- Storyline Card -->
      <div class="storyline-card">
        <h3>: SYNOPSIS / STORYLINE :</h3>
        <p>${escapeHtml(movie.description || movie.synopsis || '')}</p>
      </div>

      <!-- Screenshots Gallery (Real images from source) -->
      ${movie.screenshots && movie.screenshots.length ? `
        <div class="hub-section-divider">
          <span class="hub-section-divider-title">: SCREEN-SHOTS :</span>
        </div>

        <div class="screenshots-hub-grid">
          ${movie.screenshots.map((src, idx) => `
            <a href="${escapeHtml(src)}" target="_blank" rel="noopener noreferrer" class="shot-frame" title="View Full Screenshot ${idx + 1}">
              <img 
                src="${escapeHtml(src)}" 
                alt="${escapeHtml(movie.title)} Screenshot ${idx + 1}" 
                loading="lazy" 
                width="360" 
                height="200" 
                onerror="this.parentElement.style.display='none'"
              />
            </a>
          `).join('')}
        </div>
      ` : ''}

      <!-- HDHub4u Signature Colorful Download Links (Pure Direct Links) -->
      <div class="hub-section-divider">
        <span class="hub-section-divider-title">: DOWNLOAD LINKS :</span>
      </div>

      <div class="download-buttons-wrap">
        ${movie.links && movie.links.length ? movie.links.map(link => {
          const q = (link.quality || '').toLowerCase();
          let btnColorClass = 'btn-hub-720p';
          if (q.includes('480')) btnColorClass = 'btn-hub-480p';
          else if (q.includes('720')) btnColorClass = 'btn-hub-720p';
          else if (q.includes('1080')) btnColorClass = 'btn-hub-1080p';
          else if (q.includes('4k') || q.includes('2160') || q.includes('uhd')) btnColorClass = 'btn-hub-4k';
          
          return `
            <a href="${escapeHtml(link.url)}" target="_blank" rel="noopener noreferrer" class="btn-hub-download ${btnColorClass}">
              <div class="btn-hub-left">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                <div>
                  <div style="font-weight: 800;">${escapeHtml(link.label)}</div>
                  ${link.size ? `<small style="opacity: 0.9; font-size: 0.78rem;">Size: ${escapeHtml(link.size)}</small>` : ''}
                </div>
              </div>
              <span class="btn-hub-cta">Download</span>
            </a>
          `;
        }).join('') : `
          <p style="text-align: center; color: var(--text-secondary);">Direct download links are currently being updated for this title.</p>
        `}
      </div>

      <!-- Share Section -->
      <div class="share-bar-hub">
        <span style="font-size: 0.85rem; color: var(--text-secondary); margin-right: 6px;">Share with Friends:</span>
        <button class="share-hub-btn" onclick="window.copyPageUrl()" title="Copy Page Link">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
          Copy Link
        </button>
        <a href="https://api.whatsapp.com/send?text=${encodeURIComponent(`${movie.title} (${movie.releaseYear}) Download on MovieHub4u`)}" target="_blank" rel="noopener noreferrer" class="share-hub-btn">
          WhatsApp
        </a>
        <a href="https://t.me/share/url?url=&text=${encodeURIComponent(`${movie.title} (${movie.releaseYear}) Download on MovieHub4u`)}" target="_blank" rel="noopener noreferrer" class="share-hub-btn">
          Telegram
        </a>
        <a href="https://twitter.com/intent/tweet?text=${encodeURIComponent(`Check out ${movie.title} (${movie.releaseYear}) on MovieHub4u`)}" target="_blank" rel="noopener noreferrer" class="share-hub-btn">
          X / Twitter
        </a>
      </div>

      <!-- Related Movies Section (Dense 6-Column Grid) -->
      ${relatedMovies.length ? `
        <section class="catalog-section" style="padding-top: 10px;">
          <div class="section-title-bar">
            <h2 class="section-title-text">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"></polygon></svg>
              Related South Hindi Releases
            </h2>
            <a href="../movies.html" style="font-size: 0.85rem; color: var(--accent-red); font-weight: 700;">View Full Hub &rarr;</a>
          </div>
          <div class="movies-grid-hub">
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
console.log('Generating category pages (HDHub4u layout)...');

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
  <title>${escapeHtml(cat.seoTitle || `${cat.name} Movies - Download | MovieHub4u`)}</title>
  <meta name="description" content="${escapeHtml(cat.seoDescription || cat.description || `Browse the best ${cat.name} movies with dual audio and full HD downloads.`)}">
  <link rel="canonical" href="category/${encodeURIComponent(cat.slug)}.html">
  <link rel="stylesheet" href="../assets/css/styles.css">
</head>
<body>
  ${getHeaderHtml(cat.slug, 1)}

  <main class="main-content" id="main-content">
    <div class="container">
      <!-- Breadcrumbs -->
      <nav class="breadcrumbs-bar" aria-label="Breadcrumbs">
        <a href="../index.html">Home</a>
        <span>&raquo;</span>
        <a href="../movies.html">Categories</a>
        <span>&raquo;</span>
        <span>${escapeHtml(cat.name)}</span>
      </nav>

      <div class="section-title-bar" style="margin-top: 14px;">
        <h1 class="section-title-text">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"></polygon></svg>
          ${escapeHtml(cat.name)} Collection (${matchingMovies.length} Titles)
        </h1>
        <a href="../search.html?category=${encodeURIComponent(cat.slug)}" style="font-size: 0.85rem; color: var(--accent-red); font-weight: 700;">Filter Category &rarr;</a>
      </div>

      ${matchingMovies.length ? `
        <div class="movies-grid-hub">
          ${matchingMovies.map(m => renderMovieCardHtml(m, 1)).join('')}
        </div>
      ` : `
        <div class="empty-state" style="text-align: center; padding: 60px 20px;">
          <h3>No titles found</h3>
          <p style="color: var(--text-secondary); margin-top: 8px;">We are actively adding more titles to the ${escapeHtml(cat.name)} collection.</p>
          <a href="../movies.html" style="display: inline-block; margin-top: 16px; background-color: var(--accent-red); color: #fff; padding: 10px 20px; border-radius: 6px; font-weight: 700;">Browse Full Catalog</a>
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
console.log('Generating index.html in HDHub4u layout...');

const indexHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>MovieHub4u - South Hindi Dubbed Movies Download | 4K & 1080p Web-DL</title>
  <meta name="description" content="Download the latest South Indian Hindi dubbed movies, dual audio releases, and blockbusters with screenshots and direct download links. No ads, no popups.">
  <link rel="canonical" href="index.html">

  <!-- Open Graph -->
  <meta property="og:type" content="website">
  <meta property="og:title" content="MovieHub4u - South Hindi Dubbed Movies">
  <meta property="og:description" content="Direct high-speed downloads, real screenshots, dual audio South Hindi films.">
  <meta property="og:image" content="${movies[0].poster}">
  <meta name="twitter:card" content="summary_large_image">

  <link rel="stylesheet" href="assets/css/styles.css">
</head>
<body>
  ${getHeaderHtml('home', 0)}

  <!-- Quick Filter Tags Bar -->
  <section class="quick-tags-section" aria-label="Quick Category Tags">
    <div class="container">
      <div class="quick-tags-wrap">
        <a href="category/south-indian.html" class="quick-tag-chip">🔥 South Hindi</a>
        <a href="category/hindi-dubbed.html" class="quick-tag-chip">🎧 Hindi Dubbed</a>
        <a href="category/action.html" class="quick-tag-chip">💥 Action</a>
        <a href="category/thriller.html" class="quick-tag-chip">⚡ Thriller</a>
        <a href="category/bollywood.html" class="quick-tag-chip">🎬 Bollywood</a>
        <a href="category/hollywood.html" class="quick-tag-chip">🍿 Hollywood</a>
        <a href="category/web-series.html" class="quick-tag-chip">📺 Web Series</a>
        <a href="movies.html" class="quick-tag-chip">⭐ All Movies</a>
      </div>
    </div>
  </section>

  <!-- Main Content: Dense Movie Grids (HDHub4u Signature Style) -->
  <main class="main-content" id="main-content">
    <div class="container">
      
      <!-- Latest Releases Section -->
      <section class="catalog-section" aria-labelledby="latest-heading">
        <div class="section-title-bar">
          <h2 id="latest-heading" class="section-title-text">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"></polygon></svg>
            Latest South Hindi Dubbed Movies
          </h2>
          <a href="movies.html" style="font-size: 0.88rem; color: var(--accent-red); font-weight: 700;">View All (${movies.length}) &rarr;</a>
        </div>
        
        <div class="movies-grid-hub">
          ${movies.map(m => renderMovieCardHtml(m, 0)).join('')}
        </div>
      </section>

    </div>
  </main>

  ${getFooterHtml(0)}
</body>
</html>`;

fs.writeFileSync(path.join(ROOT_DIR, 'index.html'), indexHtml, 'utf-8');
console.log('Successfully updated index.html.');

// -------------------------------------------------------------
// 4. GENERATE DYNAMIC CATALOG (movies.html)
// -------------------------------------------------------------
console.log('Generating movies.html catalog...');

const moviesHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>All Movies - Explore Our Complete Catalog | MovieHub4u</title>
  <meta name="description" content="Browse our complete collection of South Indian Hindi Dubbed movies. Filter by quality (4K, 1080p), audio, and genre.">
  <link rel="canonical" href="movies.html">
  <link rel="stylesheet" href="assets/css/styles.css">
</head>
<body>
  ${getHeaderHtml('movies', 0)}

  <main class="main-content" id="main-content">
    <div class="container">
      <nav class="breadcrumbs-bar" aria-label="Breadcrumbs">
        <a href="index.html">Home</a>
        <span>&raquo;</span>
        <span>All Movies</span>
      </nav>

      <div class="section-title-bar" style="margin-top: 14px; flex-wrap: wrap; gap: 14px;">
        <h1 class="section-title-text">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"></polygon></svg>
          All Movies &amp; Dubbed Releases
        </h1>

        <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
          <select id="filter-category" class="filter-select" aria-label="Filter by Category" style="background: var(--bg-surface); color: #fff; border: 1px solid var(--border-card); padding: 6px 12px; border-radius: 4px; font-size: 0.84rem;">
            <option value="all">All Categories</option>
            <option value="south-indian">South Indian</option>
            <option value="hindi-dubbed">Hindi Dubbed</option>
            <option value="action">Action</option>
            <option value="thriller">Thriller</option>
            <option value="bollywood">Bollywood</option>
            <option value="hollywood">Hollywood</option>
          </select>

          <select id="filter-quality" class="filter-select" aria-label="Filter by Quality" style="background: var(--bg-surface); color: #fff; border: 1px solid var(--border-card); padding: 6px 12px; border-radius: 4px; font-size: 0.84rem;">
            <option value="all">All Qualities</option>
            <option value="4K UHD">4K UHD</option>
            <option value="1080p">1080p Full HD</option>
            <option value="720p">720p HD</option>
            <option value="480p">480p</option>
          </select>

          <select id="filter-sort" class="filter-select" aria-label="Sort Movies" style="background: var(--bg-surface); color: #fff; border: 1px solid var(--border-card); padding: 6px 12px; border-radius: 4px; font-size: 0.84rem;">
            <option value="latest">Sort: Recently Added</option>
            <option value="rating">Sort: Highest Rated</option>
            <option value="year">Sort: Release Year</option>
            <option value="title">Sort: Title (A-Z)</option>
          </select>

          <button id="reset-filters-btn" type="button" style="background: #23293d; color: #fff; border: none; padding: 6px 14px; border-radius: 4px; font-size: 0.84rem; cursor: pointer;">Reset</button>
        </div>
      </div>

      <div style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 16px;">
        <span id="catalog-count">Showing ${movies.length} movies</span>
      </div>

      <div class="movies-grid-hub" id="catalog-grid">
        ${movies.map(m => renderMovieCardHtml(m, 0)).join('')}
      </div>

      <div id="catalog-empty" class="empty-state" style="display: none; text-align: center; padding: 60px 20px;">
        <h3>No matching movies found</h3>
        <p style="color: var(--text-secondary); margin-top: 8px;">Try adjusting your filters.</p>
        <button onclick="document.getElementById('reset-filters-btn').click()" style="margin-top: 14px; background: var(--accent-red); color: #fff; border: none; padding: 8px 18px; border-radius: 4px; cursor: pointer;">Reset Filters</button>
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
