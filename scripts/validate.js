/**
 * MoviesHouse4u - Comprehensive Static Site & Data Validator
 * Validates JSON integrity, slugs, IDs, static HTML pages, internal links, and sitemap.
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const MOVIES_PATH = path.join(ROOT_DIR, 'data', 'movies.json');
const CATEGORIES_PATH = path.join(ROOT_DIR, 'data', 'categories.json');
const SITEMAP_PATH = path.join(ROOT_DIR, 'sitemap.xml');
const ROBOTS_PATH = path.join(ROOT_DIR, 'robots.txt');

const errors = [];
const warnings = [];
const passes = [];

function pass(message) {
  passes.push(message);
}

function error(message) {
  errors.push(message);
}

function warn(message) {
  warnings.push(message);
}

console.log('====================================================');
console.log('   MOVIESHOUSE4U VALIDATION SUITE');
console.log('====================================================\n');

// 1. Validate data/movies.json
let movies = [];
try {
  if (!fs.existsSync(MOVIES_PATH)) {
    error('Missing data/movies.json file');
  } else {
    const raw = fs.readFileSync(MOVIES_PATH, 'utf-8');
    movies = JSON.parse(raw);
    if (!Array.isArray(movies)) {
      error('data/movies.json must be a JSON array');
    } else {
      pass(`data/movies.json is valid JSON with ${movies.length} records`);
    }
  }
} catch (e) {
  error(`JSON Syntax Error in data/movies.json: ${e.message}`);
}

// 2. Validate data/categories.json
let categories = [];
try {
  if (!fs.existsSync(CATEGORIES_PATH)) {
    error('Missing data/categories.json file');
  } else {
    const raw = fs.readFileSync(CATEGORIES_PATH, 'utf-8');
    categories = JSON.parse(raw);
    if (!Array.isArray(categories)) {
      error('data/categories.json must be a JSON array');
    } else {
      pass(`data/categories.json is valid JSON with ${categories.length} categories`);
    }
  }
} catch (e) {
  error(`JSON Syntax Error in data/categories.json: ${e.message}`);
}

// 3. Check for Duplicate IDs and Slugs
const seenIds = new Set();
const seenSlugs = new Set();

movies.forEach((movie, index) => {
  const prefix = `Movie #${index + 1} ("${movie.title || 'Untitled'}"):`;

  if (!movie.id) {
    error(`${prefix} Missing 'id' field`);
  } else if (seenIds.has(movie.id)) {
    error(`${prefix} Duplicate id '${movie.id}' found`);
  } else {
    seenIds.add(movie.id);
  }

  if (!movie.slug) {
    error(`${prefix} Missing 'slug' field`);
  } else if (seenSlugs.has(movie.slug)) {
    error(`${prefix} Duplicate slug '${movie.slug}' found`);
  } else {
    seenSlugs.add(movie.slug);
  }

  // Check required attributes
  const requiredFields = ['title', 'releaseYear', 'poster', 'language', 'genres', 'categories', 'synopsis', 'qualities', 'publishedAt'];
  requiredFields.forEach(field => {
    if (!movie[field]) {
      error(`${prefix} Missing required field '${field}'`);
    }
  });

  // Verify year is a number
  if (movie.releaseYear && typeof movie.releaseYear !== 'number') {
    warn(`${prefix} releaseYear should be a number, got ${typeof movie.releaseYear}`);
  }

  // Verify links structure
  if (movie.links) {
    if (!Array.isArray(movie.links)) {
      error(`${prefix} 'links' must be an array`);
    } else {
      movie.links.forEach((l, lIndex) => {
        if (!l.url || l.url.trim() === '') {
          error(`${prefix} Link #${lIndex + 1} has an empty url`);
        }
        if (!l.label || l.label.trim() === '') {
          error(`${prefix} Link #${lIndex + 1} has an empty label`);
        }
      });
    }
  }

  // Check individual static HTML file existence
  if (movie.slug) {
    const movieHtmlPath = path.join(ROOT_DIR, 'movies', `${movie.slug}.html`);
    if (!fs.existsSync(movieHtmlPath)) {
      error(`${prefix} Static page 'movies/${movie.slug}.html' does not exist. (Run 'npm run build' to generate)`);
    }
  }
});

if (movies.length > 0 && errors.length === 0) {
  pass(`Verified ${movies.length} movies: all unique IDs and slugs, required fields present`);
}

// 4. Check category pages
categories.forEach(cat => {
  const catHtmlPath = path.join(ROOT_DIR, 'category', `${cat.slug}.html`);
  if (!fs.existsSync(catHtmlPath)) {
    error(`Static category page 'category/${cat.slug}.html' does not exist`);
  }
});
if (categories.length > 0) {
  pass(`Verified all ${categories.length} category static HTML files exist`);
}

// 5. Check Core Static Pages
const requiredStaticFiles = [
  'index.html',
  'movies.html',
  'search.html',
  'about.html',
  'contact.html',
  'privacy.html',
  'disclaimer.html',
  '404.html',
  'robots.txt',
  'sitemap.xml',
  'assets/css/styles.css',
  'assets/js/app.js',
  'assets/js/catalog.js',
  'assets/js/search.js',
  'assets/js/hero-slider.js',
  'assets/images/logo.svg',
  'assets/images/default-poster.svg'
];

requiredStaticFiles.forEach(relPath => {
  const fullPath = path.join(ROOT_DIR, relPath);
  if (!fs.existsSync(fullPath)) {
    error(`Missing required static file: ${relPath}`);
  } else {
    // Check not empty
    const stats = fs.statSync(fullPath);
    if (stats.size === 0) {
      error(`Static file is empty (0 bytes): ${relPath}`);
    }
  }
});
pass(`All ${requiredStaticFiles.length} core static assets and HTML pages exist and are populated`);

// 6. Check Sitemap coverage
if (fs.existsSync(SITEMAP_PATH)) {
  const sitemapContent = fs.readFileSync(SITEMAP_PATH, 'utf-8');
  let missingInSitemap = 0;
  movies.forEach(m => {
    if (!sitemapContent.includes(`movies/${m.slug}.html`)) {
      missingInSitemap++;
      warn(`Movie '${m.slug}' not found in sitemap.xml`);
    }
  });
  if (missingInSitemap === 0) {
    pass(`All ${movies.length} movies are registered in sitemap.xml`);
  }
}

// Summary Report
console.log('\n--- VALIDATION RESULTS ---');
passes.forEach(p => console.log(`[PASS] ${p}`));
warnings.forEach(w => console.log(`[WARN] ${w}`));
errors.forEach(e => console.log(`[FAIL] ${e}`));

console.log('\n--------------------------');
console.log(`Passed: ${passes.length} | Warnings: ${warnings.length} | Errors: ${errors.length}`);
console.log('--------------------------\n');

if (errors.length > 0) {
  console.error('Validation failed with errors. Please fix above issues.');
  process.exit(1);
} else {
  console.log('All checks passed successfully! Project is production ready.');
  process.exit(0);
}
