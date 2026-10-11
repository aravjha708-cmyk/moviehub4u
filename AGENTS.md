# AGENTS.md - Antigravity Content Update Protocol

This document defines the exact workflow and rules for AI coding assistants (such as Antigravity) when adding, editing, or deleting movies on CineStatic.

---

## 1. Golden Rules
1. **Single Source of Truth:** All movie metadata originates from `data/movies.json`. Category definitions reside in `data/categories.json`.
2. **Never duplicate layout code manually:** Always use `node scripts/build.js` to automatically generate pre-rendered movie detail pages (`movies/[slug].html`), category pages (`category/[slug].html`), and `sitemap.xml`.
3. **No Build Bloat:** Never install heavy bundlers (Webpack, Vite) or frameworks (React, Vue). This is a 100% pure static HTML5/CSS3/Vanilla JS website.
4. **Zero Duplicates:** Never create duplicate `id` or `slug` values.
5. **Always Validate:** Run `node scripts/validate.js` after every single content operation.

---

## 2. Adding a New Movie

When the user requests to add a movie (e.g., *"Add Fighter (2024)"*):

### Step 1: Inspect `data/movies.json`
- Determine the next sequential ID (e.g., `mov-013`).
- Create a URL-safe, lowercase slug (e.g., `fighter` or `fighter-2024`). Verify that neither ID nor slug exists.

### Step 2: Add Movie Record to `data/movies.json`
Append a new JSON object adhering strictly to the schema:
```json
{
  "id": "mov-013",
  "slug": "fighter",
  "title": "Fighter",
  "originalTitle": null,
  "releaseYear": 2024,
  "poster": "https://image.tmdb.org/t/p/w500/...",
  "thumbnail": "https://image.tmdb.org/t/p/w300/...",
  "backdrop": "https://image.tmdb.org/t/p/original/...",
  "language": "Hindi",
  "languagesAvailable": ["Hindi"],
  "categories": ["bollywood", "action", "thriller"],
  "genres": ["Action", "Thriller"],
  "country": "India",
  "runtime": "166 min",
  "director": "Siddharth Anand",
  "cast": ["Hrithik Roshan", "Deepika Padukone", "Anil Kapoor"],
  "synopsis": "Top IAF aviators face danger and interpersonal friction as they embark on perilous missions.",
  "description": "Full detailed plot description...",
  "rating": 7.0,
  "ratingSource": "IMDb",
  "qualities": ["480p", "720p", "1080p", "4K UHD"],
  "fileSizes": {
    "480p": "480 MB",
    "720p": "1.2 GB",
    "1080p": "2.8 GB",
    "4K UHD": "8.1 GB"
  },
  "formats": ["MKV", "MP4"],
  "subtitles": ["English"],
  "screenshots": [],
  "links": [
    {
      "label": "Stream on Netflix",
      "type": "official",
      "quality": "4K UHD",
      "url": "https://www.netflix.com/title/..."
    },
    {
      "label": "Download 1080p Web-DL",
      "type": "download",
      "quality": "1080p",
      "size": "2.8 GB",
      "url": "https://archive.org/details/..."
    }
  ],
  "tags": ["Hrithik Roshan", "IAF", "Air Force", "Siddharth Anand"],
  "featured": false,
  "publishedAt": "2024-03-25T10:00:00Z",
  "seoTitle": "Fighter (2024) - Watch & Download Hindi Movie in 4K & 1080p | CineStatic",
  "seoDescription": "Download and watch Fighter (2024) starring Hrithik Roshan and Deepika Padukone in 4K UHD and 1080p."
}
```

### Step 3: Run the Build Script
Execute:
```bash
node scripts/build.js
```
This automatically:
- Generates `movies/fighter.html` with breadcrumbs, technical specifications table, download links, related films, and Schema.org JSON-LD structured data.
- Updates all category pages (`category/bollywood.html`, `category/action.html`, etc.).
- Adds the new URL to `sitemap.xml`.

### Step 4: Run the Validator
Execute:
```bash
node scripts/validate.js
```
Verify that all checks pass (0 errors, 0 warnings).

### Step 5: Report to the User
Summarize the exact movie added, the generated files (`data/movies.json`, `movies/fighter.html`, `sitemap.xml`), and the passing validation output.

---

## 3. Editing an Existing Movie

1. Locate the record in `data/movies.json` by matching `id` or `slug`.
2. Update the desired fields (e.g., add new download link, change poster, update qualities).
3. Do NOT create duplicate records.
4. Execute `node scripts/build.js`.
5. Execute `node scripts/validate.js`.
6. Confirm the regenerated `movies/[slug].html` file contains the updated data.

---

## 4. Deleting a Movie

1. Remove the target record from `data/movies.json`.
2. Delete the generated static HTML page `movies/[slug].html`.
3. Execute `node scripts/build.js` to regenerate category pages, indexes, and `sitemap.xml`.
4. Execute `node scripts/validate.js` to ensure no orphaned links remain.
5. Report the deleted files and validation confirmation to the user.
