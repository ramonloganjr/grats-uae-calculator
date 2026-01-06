# Grats - UAE End-of-Service Gratuity Calculator

A modern, responsive UAE End-of-Service Gratuity Calculator that calculates gratuity in compliance with UAE Federal Decree-Law No. 33 of 2021. Supports light/dark mode, exports professional branded PDFs, and delivers accurate results with real-time currency conversion.

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

### Modern UX/UI Design
- Apple-inspired design language with premium aesthetics
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
- Complete calculation breakdown
- Scenario comparison charts
- Exchange rate information
- Custom report numbering system
- Professional footer with branding

### Performance Optimized
- Minified CSS and JavaScript
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
  </tr>
</table>

### Frontend
| Technology | Purpose |
|------------|---------|
| **HTML5** | Semantic markup with structured data (JSON-LD) |
| **CSS3** | Custom properties, animations, glassmorphism effects |
| **Vanilla JavaScript** | Pure ES6+ with no framework dependencies |
| **Inter Font** | Modern typography via Google Fonts |
| **Bootstrap Icons** | Icon library for UI elements |

### APIs and Services
| Service | Purpose |
|---------|---------|
| **ExchangeRate-API** | Primary currency conversion |
| **FXRatesAPI** | Fallback currency conversion |
| **jsPDF** | Client-side PDF generation |

### Infrastructure
| Technology | Purpose |
|------------|---------|
| **Apache (.htaccess)** | URL rewriting, security headers, caching |
| **cPanel** | Hosting and deployment |

---

## Security

### HTTP Security Headers
- **Strict-Transport-Security (HSTS):** Forces HTTPS for 1 year with preload
- **X-Frame-Options:** DENY - Prevents clickjacking attacks
- **X-Content-Type-Options:** nosniff - Prevents MIME sniffing
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

### Additional Security Measures
- Server signature hiding
- Directory listing disabled
- Sensitive file protection (.htaccess, .env, .git)
- Input sanitization and validation
- No external tracking or analytics

---

## Installation

### Development
```bash
# Clone the repository
git clone https://github.com/ramonloganjr/grats-uae-calculator.git

# Navigate to directory
cd grats-uae-calculator

# Serve locally (using any static server)
npx http-server -p 8080
```

### Production (cPanel)
1. Upload all files to your `public_html` directory
2. Ensure `.htaccess` file is included for clean URLs and security headers
3. Verify SSL certificate is active for HTTPS

---

## File Structure

```
grats-uae-calculator/
├── index.html          # Main application page
├── 404.html            # Custom error page
├── robots.txt          # Search engine directives
├── .htaccess           # Apache configuration
├── css/
│   └── styles.css      # Minified stylesheet
├── js/
│   ├── script.js       # Minified main application logic
│   └── protection.js   # Console branding
└── img/
    ├── logo.svg        # Application logo
    ├── favicon.ico     # Browser favicon
    ├── favicon.png     # PNG favicon
    ├── grats.png       # PDF header logo
    ├── grats-og.png    # Open Graph image
    ├── logo-pdf.png    # PDF export logo
    └── dirham.svg      # AED currency icon
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
| <img src="https://img.shields.io/badge/Email-1877F2?style=flat&logo=gmail&logoColor=white" height="20" /> | [iam@ramonloganjr.com](mailto:iam@ramonloganjr.com) |
| <img src="https://img.shields.io/badge/Website-1877F2?style=flat&logo=googlechrome&logoColor=white" height="20" /> | [www.ramonloganjr.com](https://www.ramonloganjr.com) |
| <img src="https://img.shields.io/badge/LinkedIn-1877F2?style=flat&logo=linkedin&logoColor=white" height="20" /> | [linkedin.com/in/ramon-logan-jr](https://www.linkedin.com/in/ramon-logan-jr/) |
| <img src="https://img.shields.io/badge/GitHub-1877F2?style=flat&logo=github&logoColor=white" height="20" /> | [github.com/ramonloganjr](https://github.com/ramonloganjr) |

---

## License

Copyright 2025 Ramon Logan Jr. All Rights Reserved.

---

<p align="center">
  <strong>Grats</strong> - Empowering UAE workers with clarity, precision, and confidence in their end-of-service benefits.
</p>
