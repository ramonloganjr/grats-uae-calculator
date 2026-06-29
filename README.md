# Grats - UAE End-of-Service Gratuity Calculator

A modern, responsive UAE End-of-Service Gratuity Calculator that calculates gratuity in compliance with UAE Federal Decree-Law No. 33 of 2021. It is an installable Progressive Web App with offline support, supports light and dark mode, exports professional branded PDFs, includes native sharing, and delivers accurate results with real-time currency conversion.

**Live Demo:** [grats.ramonloganjr.com](https://grats.ramonloganjr.com)

---

## Features

### Core Calculation Engine
- Accurate gratuity calculation based on UAE Federal Decree-Law No. 33 of 2021
- Support for Limited and Unlimited contract types
- Multiple departure scenarios (Resignation, Termination, Contract End)
- Year-by-year breakdown of accumulated gratuity
- Scenario comparison to help users understand the financial impact of each departure option
- Unpaid leave deduction from service period
- Maximum gratuity cap enforcement (2 years' salary)

### Multi-Currency Support
- Real-time currency conversion using dual API failover
- Support for 30+ currencies including INR, PKR, PHP, BDT, USD, EUR, GBP, and more
- Automatic exchange rate updates every 30 minutes
- Fallback to cached rates when APIs are unavailable

### Industry Categories
- Public and Private sector options
- 40+ industry categories including:
  - Oil and Gas, Petrochemicals
  - Construction, Real Estate, Architecture and Engineering
  - Banking and Finance, Insurance, Investment and Securities
  - Information Technology, Telecommunications, FinTech
  - Healthcare and Medical, Pharmaceuticals
  - Aviation, Logistics, Transportation, Maritime
  - Hospitality, Tourism, Restaurants, Retail
  - Manufacturing, Education, Media, Government
  - Legal Services, Consulting, and more

### Progressive Web App (PWA)
- Installable on desktop and mobile for an app-like experience
- Offline support through a service worker with an offline fallback page
- App shell precaching for fast repeat loads
- Tiered caching strategy:
  - Navigations use network-first with an offline fallback
  - Same-origin assets use stale-while-revalidate
  - Trusted CDN assets use cache-first
  - Exchange-rate APIs are never cached so currency data stays live
- Standards-compliant Web App Manifest with maskable icons (192px and 512px), screenshots, shortcuts, and launch handling
- Non-intrusive, dismissible install prompt with an iOS Safari fallback hint
- Service worker auto-purges old caches on each new build

### Native Sharing
- One-tap sharing using the platform native share sheet via the Web Share API
- Graceful fallback modal on browsers without native share support
- Direct share targets for WhatsApp, Telegram, X (Twitter), and Facebook
- Copy-to-clipboard for the application link with a clipboard fallback
- Accessible dialog with keyboard, backdrop, and close-button dismissal

### Modern UX/UI Design
- Apple-inspired design language with premium aesthetics
- Fine dotted grid background tuned for both light and dark mode
- Dark/Light theme with system preference detection
- Smooth CSS transitions and micro-animations
- Responsive design optimized for all devices (mobile, tablet, desktop)
- Touch-optimized interactive elements
- Glassmorphism effects with backdrop blur
- Custom SVG currency icons

### Accessibility (WCAG 2.1 AA)
- Full keyboard navigation support
- ARIA labels and roles for screen readers
- Semantic HTML5 structure
- High contrast mode support
- Reduced motion preferences respected
- Focus indicators for all interactive elements

### Professional PDF Export
- Apple-style branded PDF reports
- Brand logo rendered in the header of every page
- Automatic multi-page layout with repeated header and page-break handling
- Logo embedded as a base64 data URI for reliable rendering on any host, including local files
- Complete calculation breakdown
- Scenario comparison
- Exchange rate information
- Custom report numbering system
- Professional footer with branding

### Performance Optimized
- Minified HTML, CSS, and JavaScript
- Content-hash cache-busting on CSS and JS so deploys are picked up immediately
- Lazy loading for non-critical resources
- Preconnect and DNS prefetch for external resources
- GZIP compression enabled via .htaccess
- Optimized asset caching strategy
- CLS (Cumulative Layout Shift) monitoring

---

## Tech Stack

<table>
  <tr>
    <td align="center" width="96">
      <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg" width="48" height="48" alt="HTML5" />
      <br>HTML5
    </td>
    <td align="center" width="96">
      <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg" width="48" height="48" alt="CSS3" />
      <br>CSS3
    </td>
    <td align="center" width="96">
      <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" width="48" height="48" alt="JavaScript" />
      <br>JavaScript
    </td>
    <td align="center" width="96">
      <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" width="48" height="48" alt="Node.js" />
      <br>Node.js
    </td>
  </tr>
</table>

### Frontend
| Technology | Purpose |
|------------|---------|
| **HTML5** | Semantic markup with structured data (JSON-LD) |
| **CSS3** | Custom properties, animations, glassmorphism effects |
| **Vanilla JavaScript** | Pure ES6+ with no framework dependencies |
| **Service Worker** | Offline support and runtime caching |
| **Web App Manifest** | Installable PWA metadata and icons |
| **Inter Font** | Modern typography via Google Fonts |
| **Bootstrap Icons** | Icon library for UI elements |

### APIs and Services
| Service | Purpose |
|---------|---------|
| **ExchangeRate-API** | Primary currency conversion |
| **FXRatesAPI** | Fallback currency conversion |
| **jsPDF** | Client-side PDF generation |
| **Web Share API** | Native device sharing |

### Build Tooling
| Tool | Purpose |
|------|---------|
| **Node.js** | Build runtime for the production pipeline |
| **terser** | JavaScript minification |
| **clean-css** | CSS minification |
| **html-minifier-terser** | HTML minification |

### Infrastructure
| Technology | Purpose |
|------------|---------|
| **Apache (.htaccess)** | URL rewriting, security headers, caching, service worker headers |
| **cPanel** | Hosting and deployment |

---

## Security

### HTTP Security Headers
- **Strict-Transport-Security (HSTS):** Forces HTTPS for 1 year with preload
- **X-Frame-Options:** DENY, prevents clickjacking attacks
- **X-Content-Type-Options:** nosniff, prevents MIME sniffing
- **X-XSS-Protection:** Enabled for legacy browser support
- **Referrer-Policy:** strict-origin-when-cross-origin
- **Permissions-Policy:** Disables geolocation, microphone, camera, payment, and USB APIs

### Content Security Policy (CSP)
```
default-src 'self';
script-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com https://api.exchangerate-api.io https://api.fxratesapi.com;
style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdn.jsdelivr.net;
font-src 'self' https://fonts.gstatic.com https://cdn.jsdelivr.net;
img-src 'self' data:;
connect-src 'self' https://api.exchangerate-api.io https://api.fxratesapi.com;
```

### Cache and Service Worker Headers
- Service worker (`sw.js`) served with no-cache and `Service-Worker-Allowed: /` for root scope
- HTML served with no-cache and must-revalidate so content-hashed asset URLs are never stale
- Long-lived caching for static assets, paired with cache-busting for safe updates

### Additional Security Measures
- Server signature hiding
- Directory listing disabled
- Sensitive file protection (.htaccess, .env, .git)
- Input sanitization and validation
- No external tracking or analytics

---

## Installation and Development

```bash
# Clone the repository
git clone https://github.com/ramonloganjr/grats-uae-calculator.git

# Navigate to directory
cd grats-uae-calculator

# Serve the source locally (using any static server)
npx http-server -p 8080
```

The application source runs directly without a build step for local development. A Node.js build pipeline is used to produce the minified, cache-busted production bundle.

---

## Production Build

The build pipeline minifies HTML, CSS, JS, and JSON, appends content-hash cache-busting to CSS and JS references, stamps the service worker version, and copies static assets into a `dist/` folder ready for upload.

```bash
# Install build dependencies (one time)
npm install

# Generate the production bundle into dist/
npm run build

# Remove the dist/ output
npm run clean
```

Notes:
- `node_modules/` and `dist/` are excluded from version control.
- Each build generates new content hashes for any changed assets, so returning visitors always receive the latest CSS and JS.
- The service worker version is derived from those hashes, which purges stale caches automatically on activation.

---

## Deployment (cPanel)

1. Run `npm run build` to generate the `dist/` folder.
2. Upload the contents of `dist/` (not the folder itself) to your `public_html` directory, overwriting existing files.
3. Ensure `sw.js` and `manifest.json` are placed at the web root.
4. Ensure the `.htaccess` file is included for clean URLs, security headers, and caching.
5. Verify the SSL certificate is active for HTTPS, which is required for the PWA and installation.
6. On first visit after a deploy, hard-refresh once to clear any previously cached HTML. The cache-busting and headers handle subsequent updates automatically.

---

## File Structure

```
grats-uae-calculator/
├── index.html              # Main application page
├── 404.html                # Custom error page
├── offline.html            # Offline fallback page (PWA)
├── manifest.json           # Web app manifest (installable PWA metadata)
├── sw.js                   # Service worker (offline and caching)
├── sitemap.xml             # XML sitemap for search engines
├── robots.txt              # Search engine directives
├── .htaccess               # Apache configuration
├── package.json            # Build scripts and dev dependencies
├── build.js                # Production build pipeline
├── .gitignore              # Version control exclusions
├── css/
│   └── styles.css          # Stylesheet
├── js/
│   ├── script.js           # Main application logic
│   ├── protection.js       # Console branding and dynamic copyright year
│   ├── pwa.js              # Service worker registration and install prompt
│   └── logo-data.js        # Base64 PDF logo data
└── img/
    ├── logo.svg            # Application logo
    ├── favicon.ico         # Browser favicon
    ├── favicon.png         # PNG favicon
    ├── grats.png           # PDF header logo source
    ├── grats-og.png        # Open Graph image and PWA screenshot
    ├── logo-pdf.png        # PDF export logo
    ├── icon-192.png        # PWA icon (192px)
    ├── icon-maskable-192.png  # PWA maskable icon (192px)
    ├── icon-maskable-512.png  # PWA maskable icon (512px)
    └── dirham.svg          # AED currency icon
```

---

## Legal Compliance

This calculator is based on **UAE Federal Decree-Law No. 33 of 2021** concerning the Regulation of Labour Relations in the Private Sector.

### Disclaimer
This tool provides informational estimates only and does not constitute legal advice. Actual gratuity amounts may vary based on:
- Unpaid leave periods
- Employer deductions
- Dismissal circumstances
- Contract terms and legacy provisions

For official determinations, consult the Ministry of Human Resources and Emiratisation (MoHRE) or qualified legal counsel.

---

## Developer

<table>
  <tr>
    <td>
      <img src="https://img.shields.io/badge/Developer-Ramon%20Logan%20Jr.-1877F2?style=for-the-badge" alt="Developer"/>
    </td>
  </tr>
</table>

|  |  |
|--|--|
| <img src="https://img.shields.io/badge/Email-1877F2?style=flat&logo=gmail&logoColor=white" height="20" /> | [hello@ramonloganjr.com](mailto:hello@ramonloganjr.com) |
| <img src="https://img.shields.io/badge/Website-1877F2?style=flat&logo=googlechrome&logoColor=white" height="20" /> | [www.ramonloganjr.com](https://www.ramonloganjr.com) |
| <img src="https://img.shields.io/badge/LinkedIn-1877F2?style=flat&logo=linkedin&logoColor=white" height="20" /> | [linkedin.com/in/ramon-logan-jr](https://www.linkedin.com/in/ramon-logan-jr/) |
| <img src="https://img.shields.io/badge/GitHub-1877F2?style=flat&logo=github&logoColor=white" height="20" /> | [github.com/ramonloganjr](https://github.com/ramonloganjr) |

---

## License

Copyright © Ramon Logan Jr. All Rights Reserved.

---

<p align="center">
  <strong>Grats</strong> - Empowering UAE workers with clarity, precision, and confidence in their end-of-service benefits.
</p>
