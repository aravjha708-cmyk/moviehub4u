/**
 * CineStatic - Static Site Generator
 * Generates pre-rendered HTML for all movie pages, category pages, index.html, and sitemap.xml.
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
        <a href="${prefix}category/bollywood.html" class="nav-link ${activeTab === 'bollywood' ? 'active' : ''}">Bollywood</a>
        <a href="${prefix}category/hollywood.html" class="nav-link ${activeTab === 'hollywood' ? 'active' : ''}">Hollywood</a>
        <a href="${prefix}category/south-indian.html" class="nav-link ${activeTab === 'south-indian' ? 'active' : ''}">South Indian</a>
        <a href="${prefix}category/hindi-dubbed.html" class="nav-link ${activeTab === 'hindi-dubbed' ? 'active' : ''}">Hindi Dubbed</a>
        <a href="${prefix}category/web-series.html" class="nav-link ${activeTab === 'web-series' ? 'active' : ''}">Web Series</a>
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
    <a href="${prefix}category/bollywood.html" class="nav-link ${activeTab === 'bollywood' ? 'active' : ''}">Bollywood</a>
    <a href="${prefix}category/hollywood.html" class="nav-link ${activeTab === 'hollywood' ? 'active' : ''}">Hollywood</a>
    <a href="${prefix}category/south-indian.html" class="nav-link ${activeTab === 'south-indian' ? 'active' : ''}">South Indian</a>
    <a href="${prefix}category/hindi-dubbed.html" class="nav-link ${activeTab === 'hindi-dubbed' ? 'active' : ''}">Hindi Dubbed</a>
    <a href="${prefix}category/web-series.html" class="nav-link ${activeTab === 'web-series' ? 'active' : ''}">Web Series</a>
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
            CineStatic is an ultra-fast, lightweight movie discovery portal providing authorized streaming links, multi-audio downloads, and comprehensive film details.
          </p>
        </div>
        <div>
          <h4 class="footer-heading">Categories</h4>
          <ul class="footer-links">
            <li><a href="${prefix}category/bollywood.html">Bollywood</a></li>
            <li><a href="${prefix}category/hollywood.html">Hollywood</a></li>
            <li><a href="${prefix}category/south-indian.html">South Indian</a></li>
            <li><a href="${prefix}category/hindi-dubbed.html">Hindi Dubbed</a></li>
            <li><a href="${prefix}category/web-series.html">Web Series</a></li>
          </ul>
        </div>
        <div>
          <h4 class="footer-heading">Genres</h4>
          <ul class="footer-links">
            <li><a href="${prefix}category/action.html">Action</a></li>
            <li><a href="${prefix}category/sci-fi.html">Sci-Fi</a></li>
            <li><a href="${prefix}category/drama.html">Drama</a></li>
            <li><a href="${prefix}category/comedy.html">Comedy</a></li>
            <li><a href="${prefix}category/thriller.html">Thriller</a></li>
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

  // Schema.org JSON-LD structured data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Movie",
    "name": movie.title,
    "image": movie.poster,
    "description": movie.synopsis || movie.description,
    "dateCreated": String(movie.releaseYear),
    "director": movie.director ? { "@type": "Person", "name": movie.director } : undefined,
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
  <title>${escapeHtml(movie.seoTitle || `${movie.title} (${movie.releaseYear}) - Watch & Download | CineStatic`)}</title>
  <meta name="description" content="${escapeHtml(movie.seoDescription || movie.synopsis || `Download and watch ${movie.title} in HD and 4K.`)}">
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
        </div>

        <!-- Info Column -->
        <div class="movie-info-column">
          <h1 class="detail-title">${escapeHtml(movie.title)}</h1>
          ${movie.originalTitle ? `<p class="detail-original-title">Original Title: ${escapeHtml(movie.originalTitle)}</p>` : ''}

          <div class="detail-meta-pills">
            <span class="meta-pill">${movie.releaseYear || ''}</span>
            ${movie.runtime ? `<span class="meta-pill">${escapeHtml(movie.runtime)}</span>` : ''}
            <span class="meta-pill">${escapeHtml(movie.language || 'Hindi')}</span>
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
            <h2>Synopsis</h2>
            <p class="synopsis-text">${escapeHtml(movie.description || movie.synopsis || '')}</p>
          </div>

          <!-- Technical Specs Table -->
          <div class="specs-table-wrap">
            <table class="specs-table">
              <tbody>
                ${movie.director ? `<tr><th>Director</th><td>${escapeHtml(movie.director)}</td></tr>` : ''}
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

          <!-- Download & Streaming Destinations -->
          <div class="download-action-box">
            <div class="action-header">
              <h3>Watch & Download Options</h3>
              <p>Official verified streaming destinations and direct high-speed download links.</p>
            </div>
            
            <div class="links-list">
              ${movie.links && movie.links.length ? movie.links.map(link => {
                const isOfficial = link.type === 'official';
                return `
                  <a href="${escapeHtml(link.url)}" target="_blank" rel="noopener noreferrer" class="link-btn-card ${isOfficial ? 'official' : ''}">
                    <div class="link-btn-left">
                      <div class="link-icon-wrap">
                        ${isOfficial ? `
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                        ` : `
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                        `}
                      </div>
                      <div class="link-info-text">
                        <span class="link-label">${escapeHtml(link.label)}</span>
                        <span class="link-submeta">
                          ${link.quality ? `${escapeHtml(link.quality)} ` : ''}
                          ${link.size ? `&bull; ${escapeHtml(link.size)}` : ''}
                        </span>
                      </div>
                    </div>
                    <span class="link-cta-badge">
                      ${isOfficial ? 'Stream Now' : 'Download'}
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                    </span>
                  </a>
                `;
              }).join('') : `
                <p style="color: var(--text-secondary); font-size: 0.9rem;">Official streaming links are being updated for this title.</p>
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

        </div>
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

  // Match movies that have this category or genre
  const matchingMovies = movies.filter(m => {
    const inCats = m.categories && m.categories.includes(cat.slug);
    const inGenres = m.genres && m.genres.some(g => g.toLowerCase() === cat.slug.toLowerCase());
    return inCats || inGenres;
  });

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(cat.seoTitle || `${cat.name} Movies - Watch & Download | CineStatic`)}</title>
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
// 3. GENERATE SITEMAP (sitemap.xml)
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
// 4. GENERATE ROBOTS.TXT
// -------------------------------------------------------------
const robotsTxt = `User-agent: *
Allow: /

Sitemap: sitemap.xml
`;
fs.writeFileSync(path.join(ROOT_DIR, 'robots.txt'), robotsTxt, 'utf-8');
console.log('Generated robots.txt.');

console.log('Build complete! All static pages and sitemap are up to date.');
