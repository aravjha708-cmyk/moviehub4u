# MoviesHouse4u 🎬⚡

> **A Lightning-Fast Static Movie Discovery Website Built for GitHub Pages**

MoviesHouse4u is a pure static entertainment website built exclusively with **HTML5, modern CSS3, and Vanilla JavaScript**. Designed for speed, privacy, and zero server maintenance, it hosts curated collections of Bollywood, Hollywood, South Indian, Hindi Dubbed cinema, and acclaimed web series.

---

## ✨ Features

- **⚡ Lightning-Fast Performance:** Pure static HTML pages with zero client-side framework bloat, system typography, and native lazy loading.
- **🎨 Cinematic Aesthetic:** Deep dark charcoal background (`#0a0c10`), crisp surface cards, crimson accents (`#e50914`), and 2:3 responsive poster grids.
- **📱 100% Mobile Responsive:** Optimized touch drawer navigation, adaptive card grids, and seamless reading on mobile, tablet, and desktop.
- **🔍 Instant Local Search & Filters:** Instantaneous client-side filtering by category, video quality (4K UHD, 1080p, 720p), language, and keywords without external API queries.
- **📄 Individual Static Movie Pages:** Every movie has its own standalone HTML page (`movies/[slug].html`) with technical specifications tables, verified download/streaming links, related titles, and social share links.
- **🚀 SEO & Social Ready:** Complete Schema.org `Movie` JSON-LD structured data, dynamic XML sitemap (`sitemap.xml`), `robots.txt`, and Open Graph tags.
- **🤖 Built for AI Maintenance:** Maintainable via Antigravity using `data/movies.json` as the single source of truth.

---

## 📁 Project Structure

```
/
├── index.html                   # Homepage (Compact Hero, Latest & Featured Releases)
├── movies.html                  # Full Catalog with interactive filters & sorting
├── search.html                  # Instant Search & Deep Filtering
├── about.html                   # About page
├── contact.html                 # Contact & DMCA information
├── privacy.html                 # Privacy Policy (Zero trackers)
├── disclaimer.html              # Content disclaimer & legal notice
├── 404.html                     # Custom 404 error page for GitHub Pages
├── robots.txt                   # Search crawler directives
├── sitemap.xml                  # Complete dynamic XML sitemap
├── AGENTS.md                    # Instructions for Antigravity AI updates
├── package.json                 # Helper scripts (build, validate, serve)
├── .github/
│   └── workflows/
│       └── deploy.yml           # Automated GitHub Pages CI/CD workflow
├── data/
│   ├── movies.json              # Central movie database (Single Source of Truth)
│   └── categories.json          # Category definitions & SEO descriptions
├── category/                    # Pre-rendered static category pages
│   ├── bollywood.html
│   ├── hollywood.html
│   ├── south-indian.html
│   ├── hindi-dubbed.html
│   ├── web-series.html
│   └── ...
├── movies/                      # Pre-rendered individual static movie pages
│   ├── interstellar.html
│   ├── rrr.html
│   ├── 3-idiots.html
│   ├── oppenheimer.html
│   └── ...
├── assets/
│   ├── css/
│   │   └── styles.css           # Pure responsive CSS3 design system
│   ├── js/
│   │   ├── app.js               # Mobile navigation, image fallback, share toast
│   │   ├── catalog.js           # Filtering & sorting logic for movies.html
│   │   └── search.js            # Instant live search logic for search.html
│   └── images/
│       ├── logo.svg             # Vector site logo
│       └── default-poster.svg   # Vector fallback poster
└── scripts/
    ├── build.js                 # Static generator for movie pages, categories, sitemap
    └── validate.js              # Comprehensive validation suite
```

---

## 🛠️ Local Development & Quick Start

### Prerequisites
- Node.js (v18 or higher - uses standard library only, zero npm dependencies required).

### Commands
```bash
# 1. Regenerate static pages, categories, and sitemap:
npm run build

# 2. Run data integrity and link validation checks:
npm run validate

# 3. Preview locally with any HTTP server:
npm run serve
# Or: npx serve .
# Or: python -m http.server 8000
```

---

## 🚀 Deploying to GitHub Pages

### Method 1: Automatic GitHub Actions (Recommended)
This repository includes `.github/workflows/deploy.yml`.
1. Push your repository to GitHub.
2. Go to **Settings** > **Pages** in your GitHub repository.
3. Under **Build and deployment** > **Source**, select **GitHub Actions**.
4. Every push to `main` will automatically build, validate, and deploy the website.

### Method 2: Deploy from Branch / Root
1. Run `npm run build` locally to generate all HTML pages.
2. Commit and push the workspace to your `main` branch.
3. In GitHub repository **Settings** > **Pages**, set **Source** to **Deploy from a branch**, branch `main`, folder `/ (root)`.
4. Click **Save**. Your site will be live within minutes at `https://<username>.github.io/<repository-name>/`.

---

## 🌐 Custom Domain Setup

1. In GitHub repository **Settings** > **Pages**, enter your custom domain (e.g., `movies.yourdomain.com` or `yourcinemasite.com`) in the **Custom domain** field.
2. Add a `CNAME` file in the root containing your custom domain.
3. In your DNS provider (Cloudflare, Namecheap, GoDaddy):
   - For an apex domain (`example.com`): Add `A` records pointing to GitHub's IPs (`185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`).
   - For a subdomain (`movies.example.com`): Add a `CNAME` record pointing to `<username>.github.io`.
4. Check **Enforce HTTPS** in GitHub Pages settings.

---

## 📝 Updating Movies with Antigravity

To add or edit a movie, simply ask Antigravity:
> *"Add the movie Fighter (2024) to the website with Hindi audio, 4K and 1080p qualities, and official streaming links."*

Antigravity will follow the strict protocol defined in `AGENTS.md`:
1. Add the record to `data/movies.json`.
2. Run `npm run build` to generate `movies/[slug].html` and update `sitemap.xml`.
3. Run `npm run validate` to ensure 0 errors.
4. Report the exact changes.
