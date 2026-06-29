/*
 * Grats — production build for cPanel static hosting.
 * Minifies HTML / CSS / JS / JSON into ./dist, copies binary + config assets verbatim.
 *
 * Cache strategy:
 *  - CSS/JS referenced from HTML get a content-hash ?v= query (auto cache-busting),
 *    so a new deploy is always picked up even behind the 1-month asset cache.
 *  - The service worker VERSION is stamped with a build id derived from those hashes,
 *    so its caches are purged on activate whenever any asset changes.
 *
 * Run: npm run build   →   upload the contents of ./dist to public_html.
 */
'use strict';

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { minify: minifyJS } = require('terser');
const CleanCSS = require('clean-css');
const { minify: minifyHTML } = require('html-minifier-terser');

const ROOT = __dirname;
const OUT = path.join(ROOT, 'dist');

// JS/CSS that the HTML links to — these are hashed and cache-busted.
const JS_ASSETS = ['js/script.js', 'js/protection.js', 'js/logo-data.js', 'js/pwa.js'];
const CSS_FILES = ['css/styles.css'];
// Service worker is registered (not linked in HTML) and served no-cache; versioned separately.
const SW_FILE = 'sw.js';
const HTML_FILES = ['index.html', '404.html', 'offline.html'];
const JSON_FILES = ['manifest.json'];
const COPY_FILES = ['.htaccess', 'robots.txt', 'sitemap.xml'];
const COPY_DIRS = ['img'];

const HTML_OPTS = {
  collapseWhitespace: true,
  conservativeCollapse: false,
  removeComments: true,
  removeRedundantAttributes: false,
  removeScriptTypeAttributes: false,
  removeStyleLinkTypeAttributes: false,
  minifyCSS: true,
  minifyJS: true,
  keepClosingSlash: true,
  decodeEntities: false
};

const hashes = {}; // rel path -> 8-char content hash
let totalBefore = 0;
let totalAfter = 0;

function shortHash(content) {
  return crypto.createHash('sha1').update(content).digest('hex').slice(0, 8);
}

function ensureDir(p) { fs.mkdirSync(path.dirname(p), { recursive: true }); }

function report(rel, before, after) {
  totalBefore += before;
  totalAfter += after;
  const pct = before ? ((1 - after / before) * 100).toFixed(1) : '0.0';
  console.log(`  ${rel.padEnd(24)} ${(before / 1024).toFixed(1).padStart(7)} KB -> ${(after / 1024).toFixed(1).padStart(7)} KB  (-${pct}%)`);
}

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, entry.name);
    const d = path.join(dest, entry.name);
    if (entry.isDirectory()) copyDir(s, d);
    else {
      fs.copyFileSync(s, d);
      const sz = fs.statSync(s).size;
      totalBefore += sz; totalAfter += sz;
    }
  }
}

async function minifyJsFile(rel, replace) {
  const src = path.join(ROOT, rel);
  let code = fs.readFileSync(src, 'utf8');
  if (replace) code = replace(code);
  const result = await minifyJS({ [rel]: code }, { compress: true, mangle: true, format: { comments: false } });
  if (result.error) throw result.error;
  const outPath = path.join(OUT, rel);
  ensureDir(outPath);
  fs.writeFileSync(outPath, result.code, 'utf8');
  report(rel, Buffer.byteLength(code), Buffer.byteLength(result.code));
  return result.code;
}

// Append ?v=<hash> to every linked CSS/JS reference in an HTML string.
function cacheBust(html) {
  for (const [rel, h] of Object.entries(hashes)) {
    for (const ref of [rel, '/' + rel]) {
      html = html.split('"' + ref + '"').join('"' + ref + '?v=' + h + '"');
    }
  }
  return html;
}

async function run() {
  fs.rmSync(OUT, { recursive: true, force: true });
  fs.mkdirSync(OUT, { recursive: true });
  console.log('\nBuilding production bundle -> dist/\n');

  // ---- JS assets (hashed) ----
  console.log('JavaScript:');
  for (const rel of JS_ASSETS) {
    const out = await minifyJsFile(rel);
    hashes[rel] = shortHash(out);
  }

  // ---- CSS (hashed) ----
  console.log('\nCSS:');
  const cleaner = new CleanCSS({ level: 1, returnPromise: false });
  for (const rel of CSS_FILES) {
    const src = path.join(ROOT, rel);
    const code = fs.readFileSync(src, 'utf8');
    const result = cleaner.minify(code);
    if (result.errors && result.errors.length) throw new Error(result.errors.join('; '));
    const outPath = path.join(OUT, rel);
    ensureDir(outPath);
    fs.writeFileSync(outPath, result.styles, 'utf8');
    hashes[rel] = shortHash(result.styles);
    report(rel, Buffer.byteLength(code), Buffer.byteLength(result.styles));
  }

  // Build id from all asset hashes (stable unless an asset changes).
  const buildId = shortHash(Object.keys(hashes).sort().map((k) => hashes[k]).join('|'));

  // ---- Service worker (version stamped with build id) ----
  console.log('\nService worker:');
  await minifyJsFile(SW_FILE, (code) =>
    code.replace(/const VERSION = '[^']*'/, `const VERSION = 'v-${buildId}'`)
  );

  // ---- HTML (minified + cache-busted asset URLs) ----
  console.log('\nHTML:');
  for (const rel of HTML_FILES) {
    const src = path.join(ROOT, rel);
    if (!fs.existsSync(src)) { console.warn(`  ! missing ${rel}`); continue; }
    const code = fs.readFileSync(src, 'utf8');
    const busted = cacheBust(code);
    const out = await minifyHTML(busted, HTML_OPTS);
    const outPath = path.join(OUT, rel);
    ensureDir(outPath);
    fs.writeFileSync(outPath, out, 'utf8');
    report(rel, Buffer.byteLength(code), Buffer.byteLength(out));
  }

  // ---- JSON ----
  console.log('\nJSON:');
  for (const rel of JSON_FILES) {
    const src = path.join(ROOT, rel);
    const code = fs.readFileSync(src, 'utf8');
    const out = JSON.stringify(JSON.parse(code));
    const outPath = path.join(OUT, rel);
    ensureDir(outPath);
    fs.writeFileSync(outPath, out, 'utf8');
    report(rel, Buffer.byteLength(code), Buffer.byteLength(out));
  }

  // ---- Verbatim copies ----
  console.log('\nAssets (copied):');
  for (const rel of COPY_FILES) {
    const src = path.join(ROOT, rel);
    if (!fs.existsSync(src)) { console.warn(`  ! missing ${rel}`); continue; }
    const outPath = path.join(OUT, rel);
    ensureDir(outPath);
    fs.copyFileSync(src, outPath);
    const sz = fs.statSync(src).size;
    totalBefore += sz; totalAfter += sz;
    console.log(`  ${rel}`);
  }
  for (const dir of COPY_DIRS) {
    copyDir(path.join(ROOT, dir), path.join(OUT, dir));
    console.log(`  ${dir}/ (recursive)`);
  }

  const saved = ((1 - totalAfter / totalBefore) * 100).toFixed(1);
  console.log(`\nBuild id: v-${buildId}`);
  console.log(`Done. Total ${(totalBefore / 1024).toFixed(1)} KB -> ${(totalAfter / 1024).toFixed(1)} KB (-${saved}%)`);
  console.log('Upload the contents of dist/ to your cPanel public_html.\n');
}

run().catch((err) => { console.error('\nBuild failed:', err); process.exit(1); });
